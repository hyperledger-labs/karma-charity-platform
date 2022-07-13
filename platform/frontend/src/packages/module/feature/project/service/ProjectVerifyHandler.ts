import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectService } from '@core/service';
import { ProjectVerifyCommand, IProjectVerifyDto, IProjectVerifyDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectVerifyHandler extends TransportCommandAsyncHandler<IProjectVerifyDto, IProjectVerifyDtoResponse, ProjectVerifyCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private project: ProjectService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, ProjectVerifyCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectVerifyDto): Promise<IProjectVerifyDtoResponse> {
        await this.windows.question(`project.action.verify.confirmation`).yesNotPromise;
        let item = await this.api.projectVerify(params.id);
        this.project.update(params, item);

        this.notifications.info(`project.action.verify.notification`);
        return item;
    }
}
