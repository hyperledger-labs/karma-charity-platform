import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { UserUid, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { UserContainerComponent } from '../component';
import { UserOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class UserOpenHandler extends TransportCommandHandler<UserUid, UserOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private api: Client) {
        super(logger, transport, UserOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: UserUid): Promise<void> {
        let windowId = 'userOpen' + params;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let user = await this.api.userGet(Number(params));

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let content = this.windows.open(UserContainerComponent, config) as UserContainerComponent;
        content.user = user;
    }
}
