import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectService } from '../../../core/service';
import { ProjectToVerifyCommand, IProjectToVerifyDto, IProjectToVerifyDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectToVerifyHandler extends TransportCommandAsyncHandler<IProjectToVerifyDto, IProjectToVerifyDtoResponse, ProjectToVerifyCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private project: ProjectService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, ProjectToVerifyCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectToVerifyDto): Promise<IProjectToVerifyDtoResponse> {
        await this.windows.question(`project.action.toVerify.confirmation`).yesNotPromise;
        let item = await this.api.projectToVerify(params.id);
        this.project.update(params, item);
        
        this.notifications.info(`project.action.toVerify.notification`);
        return item;
    }
}
