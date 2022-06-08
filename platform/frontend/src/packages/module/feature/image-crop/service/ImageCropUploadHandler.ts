import { Injectable } from '@angular/core';
import { Client } from 'common/platform/api';
import { WindowConfig, WindowEvent, WindowService } from '@ts-core/angular';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { SettingsService } from '../../../core/service';
import { PromiseHandler } from '@ts-core/common/promise';
import { takeUntil } from 'rxjs';
import { ImageCropCommand, IImageCropDto, IImageCropDtoResponse } from '../transport';
import { ImageCropComponent } from '../component';
import { Base64Source } from '../../file/lib/base64';

@Injectable({ providedIn: 'root' })
export class ImageCropHandler extends TransportCommandAsyncHandler<IImageCropDto, IImageCropDtoResponse, ImageCropCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private windows: WindowService, private settings: SettingsService, private api: Client) {
        super(logger, transport, ImageCropCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IImageCropDto): Promise<IImageCropDtoResponse> {
        let windowId = 'imageCrop';
        if (this.windows.setOnTop(windowId)) {
            return Promise.reject('Already opened');
        }

        let config = new WindowConfig(true, false, 600, 600);
        config.id = windowId;

        let content = this.windows.open(ImageCropComponent, config) as ImageCropComponent;
        content.uploader.options.allowedFileType = !_.isEmpty(params.allowExtensions) ? params.allowExtensions : ['jpg', 'jpeg', 'png'];

        let promise = PromiseHandler.create<IImageCropDtoResponse>();
        content.events.pipe(takeUntil(content.destroyed)).subscribe(async event => {
            switch (event) {
                case ImageCropComponent.EVENT_SUBMITTED:
                    promise.resolve(new Base64Source(content.serialize()));
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
