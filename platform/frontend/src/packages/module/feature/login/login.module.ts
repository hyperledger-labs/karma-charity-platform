import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { TransportLazyModule } from '@ts-core/angular';
import { LoginContainerComponent } from './component/login-container/login-container.component';
import { LoginOpenCommand } from './transport';
import { Transport } from '@ts-core/common/transport';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [LoginContainerComponent];

@NgModule({
    imports: [CommonModule, FormsModule, MatButtonModule, SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class LoginModule extends TransportLazyModule<LoginModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'LoginModule';
    public static COMMANDS = [LoginOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<LoginModule>, transport: Transport) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return LoginModule.ID;
    }

    public get commands(): Array<string> {
        return LoginModule.COMMANDS;
    }
}
