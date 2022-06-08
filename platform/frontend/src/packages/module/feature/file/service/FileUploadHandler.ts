import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { SettingsService } from '../../../core/service';
import { FileUploadContainerComponent } from '../components';
import { PromiseHandler } from '@ts-core/common/promise';
import { takeUntil } from 'rxjs';
import { FileUploadCommand, IFileUploadDto, IFileUploadDtoResponse } from '../transport';

@Injectable({ providedIn: 'root' })
export class FileUploadHandler extends TransportCommandAsyncHandler<IFileUploadDto, IFileUploadDtoResponse, FileUploadCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private settings: SettingsService, private api: Client) {
        super(logger, transport, FileUploadCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IFileUploadDto): Promise<IFileUploadDtoResponse> {
        let windowId = 'fileUpload' + params.linkType + params.linkId;
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(false, false, 640);
        config.id = windowId;

        let content = this.windows.open(FileUploadContainerComponent, config) as FileUploadContainerComponent;
        content.initialize(params);

        let promise = PromiseHandler.create<boolean>();
        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case WindowEvent.CLOSED:
                    promise.resolve(content.serialize());
                    break;
            }
        });
        return promise.promise;

    }
}
