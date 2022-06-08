import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { WindowConfig, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { UserService } from '../../../core/service';
import { ProfileQuizComponent } from '../component/profile-quiz/profile-quiz.component';
import { ProfileQuizOpenCommand } from '../transport';
import { takeUntil } from 'rxjs';
import { CompanyAddCommand } from '../../company/transport';

@Injectable({ providedIn: 'root' })
export class ProfileQuizOpenHandler extends TransportCommandHandler<void, ProfileQuizOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private user: UserService, private api: Client) {
        super(logger, transport, ProfileQuizOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        let windowId = 'profileQuiz';
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(true, false, 600, 400);
        config.id = windowId;
        config.disableClose = true;

        let content = this.windows.open(ProfileQuizComponent, config) as ProfileQuizComponent;
        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case ProfileQuizComponent.EVENT_SUBMITTED:
                    let item = await this.api.userType({ type: content.serialize() });
                    this.user.userUpdate(item);
                    if (this.user.isCompanyManager) {
                        this.transport.send(new CompanyAddCommand());
                    }
                    content.close();
                    break;
            }
        });

    }
}
