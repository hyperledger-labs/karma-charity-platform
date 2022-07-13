import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectService } from '@core/service';
import { ProjectRejectCommand, IProjectRejectDto, IProjectRejectDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectRejectHandler extends TransportCommandAsyncHandler<IProjectRejectDto, IProjectRejectDtoResponse, ProjectRejectCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private project: ProjectService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, ProjectRejectCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectRejectDto): Promise<IProjectRejectDtoResponse> {
        await this.windows.question(`project.action.reject.confirmation`).yesNotPromise;
        let item = await this.api.projectReject(params.id);
        this.project.update(params, item);
        this.notifications.info(`project.action.reject.notification`);
        return item;
    }
}
