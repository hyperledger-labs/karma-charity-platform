import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TransportLazyModule } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [];

@NgModule({
    imports: [CommonModule, FormsModule, MatButtonModule, CKEditorModule, SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class CkeditorModule extends TransportLazyModule<CkeditorModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'CkeditorModule';
    public static COMMANDS = [];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<CkeditorModule>, transport: Transport) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return CkeditorModule.ID;
    }

    public get commands(): Array<string> {
        return CkeditorModule.COMMANDS;
    }
}
