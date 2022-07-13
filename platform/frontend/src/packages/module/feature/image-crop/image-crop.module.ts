import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TransportLazyModule } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropComponent } from './component';
import { ImageCropCommand } from './transport';
import { ImageCropHandler } from './service';
import { FileModule } from '../file';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];

const declarations = [ImageCropComponent];

@NgModule({
    imports: [CommonModule, FormsModule, MatButtonModule, ImageCropperModule, FileModule, SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class ImageCropModule extends TransportLazyModule<ImageCropModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'ImageCrop';
    public static COMMANDS = [ImageCropCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<ImageCropModule>, transport: Transport, crop: ImageCropHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return ImageCropModule.ID;
    }

    public get commands(): Array<string> {
        return ImageCropModule.COMMANDS;
    }
}
