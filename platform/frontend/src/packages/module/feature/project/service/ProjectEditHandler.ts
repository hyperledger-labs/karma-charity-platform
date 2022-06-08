import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { IProjectEditDtoResponse } from '@project/common/platform/api/project';
import { UserUid, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { PromiseHandler } from '@ts-core/common/promise';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { ProjectService } from '../../../core/service';
import { ProjectEditComponent } from '../component';
import { ProjectEditCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectEditHandler extends TransportCommandAsyncHandler<number, IProjectEditDtoResponse, ProjectEditCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private api: Client, private project: ProjectService,) {
        super(logger, transport, ProjectEditCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: number): Promise<IProjectEditDtoResponse> {
        let windowId = 'projectEdit' + params;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let item = await this.api.projectGet(params);

        let config = new WindowConfig(false, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<IProjectEditDtoResponse>();
        let content = this.windows.open(ProjectEditComponent, config) as ProjectEditComponent;
        content.project = item;

        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case ProjectEditComponent.EVENT_SUBMITTED:
                    content.isDisabled = true;
                    try {
                        item = await this.api.projectEdit(content.serialize());
                    }
                    finally {
                        content.isDisabled = false;
                    }

                    promise.resolve(item);
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
