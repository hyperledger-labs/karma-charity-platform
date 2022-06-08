import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { NotificationService, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectService } from '../../../core/service';
import { ProjectUserRoleEditCommand, IProjectUserRoleEditDto, IProjectUserRoleEditDtoResponse } from '../transport';
import { PromiseHandler } from '@ts-core/common/promise';
import { ProjectUserRoleEditComponent } from '../component/project-user-role-edit/project-user-role-edit.component';
import { takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectUserRoleEditHandler extends TransportCommandAsyncHandler<IProjectUserRoleEditDto, IProjectUserRoleEditDtoResponse, ProjectUserRoleEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private notifications: NotificationService, private api: Client) {
        super(logger, transport, ProjectUserRoleEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectUserRoleEditDto): Promise<IProjectUserRoleEditDtoResponse> {
        let windowId = 'projectUserRoleEdit' + params.userId + params.projectId;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let roles = await this.api.projectUserRoleGet(params.projectId, params.userId);

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<IProjectUserRoleEditDtoResponse>();
        let content = this.windows.open(ProjectUserRoleEditComponent, config) as ProjectUserRoleEditComponent;
        content.roles = roles;

        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case ProjectUserRoleEditComponent.EVENT_SUBMITTED:
                    let item = await this.api.projectUserRoleSet(params.projectId, params.userId, content.serialize());
                    promise.resolve({ project: item });
                    content.close();

                    break;
                case WindowEvent.CLOSED:
                    promise.reject();
                    break;
            }
        });
        return promise.promise;
    }
}
