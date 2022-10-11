import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, UserUid, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common';
import { PromiseHandler } from '@ts-core/common';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { LoginService, UserService } from '@core/service';
import { UserDeactivateCommand, UserSaveCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class UserDeactivateHandler extends TransportCommandAsyncHandler<UserUid, void, UserDeactivateCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private notifications: NotificationService, private api: Client, private login: LoginService) {
        super(logger, transport, UserDeactivateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: UserUid): Promise<void> {
        await this.windows.question(`user.action.deactivate.confirmation`).yesNotPromise;
        await this.api.deactivate();
        this.notifications.info(`user.action.deactivate.notification`);
        this.login.logout();
    }
}
