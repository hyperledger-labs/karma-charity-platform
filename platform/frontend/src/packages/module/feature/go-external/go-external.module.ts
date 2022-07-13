import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { TransportLazyModule } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { GoExternalLoginHandler, GoExternalLogoutHandler } from './service';
import { GoExternalLoginCommand, GoExternalLogoutCommand } from './transport';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [];

@NgModule({
    imports: [CommonModule, MatButtonModule, SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class GoExternalModule extends TransportLazyModule<GoExternalModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'GoExternalModule';
    public static COMMANDS = [GoExternalLoginCommand.NAME, GoExternalLogoutCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<GoExternalModule>, transport: Transport, login: GoExternalLoginHandler, logout: GoExternalLogoutHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return GoExternalModule.ID;
    }

    public get commands(): Array<string> {
        return GoExternalModule.COMMANDS;
    }
}
