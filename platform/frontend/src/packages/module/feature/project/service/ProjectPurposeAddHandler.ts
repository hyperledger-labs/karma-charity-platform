import { Injectable } from '@angular/core';
import { Client } from '@project/common/platform/api';
import { NotificationService, WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { PromiseHandler } from '@ts-core/common/promise';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { ProjectPurposeAddComponent } from '../component/project-purpose-add/project-purpose-add.component';
import { ProjectPurposeAddCommand, IProjectPurposeAddDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class ProjectPurposeAddHandler extends TransportCommandAsyncHandler<void, IProjectPurposeAddDtoResponse, ProjectPurposeAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService) {
        super(logger, transport, ProjectPurposeAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<IProjectPurposeAddDtoResponse> {
        let windowId = 'projectPurposeAdd';
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(true, false, 600);
        config.id = windowId;

        let promise = PromiseHandler.create<IProjectPurposeAddDtoResponse>();
        let content = this.windows.open(ProjectPurposeAddComponent, config) as ProjectPurposeAddComponent;

        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case ProjectPurposeAddComponent.EVENT_SUBMITTED:
                    promise.resolve(content.serialize());
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
