import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectService } from '@core/service';
import { ProjectActivateCommand, IProjectActivateDto, IProjectActivateDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectActivateHandler extends TransportCommandAsyncHandler<IProjectActivateDto, IProjectActivateDtoResponse, ProjectActivateCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private project: ProjectService, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, ProjectActivateCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectActivateDto): Promise<IProjectActivateDtoResponse> {
        await this.windows.question(`project.action.activate.confirmation`).yesNotPromise;
        let item = await this.api.projectActivate(params.id);
        this.project.update(params, item);

        this.notifications.info(`project.action.activate.notification`);
        return item;
    }
}
