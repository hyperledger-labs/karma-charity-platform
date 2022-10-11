import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import * as _ from 'lodash';
import { ProjectService } from '@core/service';
import { IProjectReportSubmitDto, IProjectReportSubmitDtoResponse, ProjectReportSubmitCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectReportSubmitHandler extends TransportCommandAsyncHandler<IProjectReportSubmitDto, IProjectReportSubmitDtoResponse, ProjectReportSubmitCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private project: ProjectService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, ProjectReportSubmitCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectReportSubmitDto): Promise<IProjectReportSubmitDtoResponse> {
        await this.windows.question(`project.action.reportSubmit.confirmation`).yesNotPromise;
        let item = await this.api.projectReportSubmit(params.id);
        this.project.update(params, item);
        
        this.notifications.info(`project.action.reportSubmit.notification`);
        return item;
    }
}
