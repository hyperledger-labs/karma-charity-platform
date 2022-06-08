import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TransportLazyModule, VICommonModule, VIComponentModule } from '@ts-core/angular';
import { FileUploadContainerComponent, FileSelectButtonComponent, FileListItemComponent } from './components';
import { UploaderDropDirective } from './directive/UploaderDropDirective';
import { FileUploadModule as BaseFileUploadModule } from 'ng2-file-upload';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Transport } from '@ts-core/common/transport';
import { FileOpenCommand, FileRemoveCommand, FileUploadCommand } from './transport';
import { FileOpenHandler, FileRemoveHandler, FileUploadHandler } from './service';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [UploaderDropDirective, FileSelectButtonComponent, FileUploadContainerComponent, FileListItemComponent];

@NgModule({
    imports: [
        CommonModule,
        VICommonModule,
        VIComponentModule,
        BaseFileUploadModule,
        MatProgressBarModule,
        MatButtonModule,
        MatListModule
    ],
    exports: declarations,
    declarations,
    providers
})
export class FileModule extends TransportLazyModule<FileModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'FileModule';
    public static COMMANDS = [FileUploadCommand.NAME, FileOpenCommand.NAME, FileRemoveCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<FileModule>,
        transport: Transport,
        open: FileOpenHandler,
        remove: FileRemoveHandler,
        upload: FileUploadHandler
    ) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return FileModule.ID;
    }

    public get commands(): Array<string> {
        return FileModule.COMMANDS;
    }
}

