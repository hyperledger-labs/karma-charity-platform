import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { TransportLazyModule } from '@ts-core/angular';
import { Transport } from '@ts-core/common';
import { VkExternalLoginHandler, VkExternalUserGetHandler, VkExternalLogoutHandler } from './service';
import { VkExternalLoginCommand, VkExternalLogoutCommand, VkExternalUserGetCommand } from './transport';

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
export class VkExternalModule extends TransportLazyModule<VkExternalModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'VkExternalModule';
    public static COMMANDS = [VkExternalLoginCommand.NAME, VkExternalLogoutCommand.NAME, VkExternalUserGetCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<VkExternalModule>, transport: Transport, login: VkExternalLoginHandler, logout: VkExternalLogoutHandler, userGet: VkExternalUserGetHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return VkExternalModule.ID;
    }

    public get commands(): Array<string> {
        return VkExternalModule.COMMANDS;
    }
}
