import { Injectable } from '@angular/core';
import { WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ProjectUserAddCommand, ProjectUserRoleEditCommand, IProjectUserAddDto, IProjectUserAddDtoResponse } from '../transport';
import { PromiseHandler } from '@ts-core/common/promise';
import { ProjectUserAddComponent } from '../component/project-user-add/project-user-add.component';
import { takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectUserAddHandler extends TransportCommandAsyncHandler<IProjectUserAddDto, IProjectUserAddDtoResponse, ProjectUserAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService) {
        super(logger, transport, ProjectUserAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IProjectUserAddDto): Promise<IProjectUserAddDtoResponse> {
        let windowId = 'projectUserAdd' + params.projectId;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<IProjectUserAddDtoResponse>();
        let content = this.windows.open(ProjectUserAddComponent, config) as ProjectUserAddComponent;
        content.projectId = params.projectId;

        let isNeedRejectOnClose = true;
        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case ProjectUserAddComponent.EVENT_SUBMITTED:
                    isNeedRejectOnClose = false;
                    promise.resolve(await this.transport.sendListen(new ProjectUserRoleEditCommand({ projectId: params.projectId, userId: content.serialize() })));
                    content.close();
                    break;
                case WindowEvent.CLOSED:
                    if (isNeedRejectOnClose) {
                        promise.reject();
                    }
                    break;
            }
        });
        return promise.promise;
    }
}
