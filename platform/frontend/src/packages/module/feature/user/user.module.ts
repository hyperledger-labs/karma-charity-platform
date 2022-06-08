import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TransportLazyModule } from '@ts-core/angular';
import { UserEditHandler, UserOpenHandler, UserSaveHandler } from './service';
import { Transport } from '@ts-core/common/transport';
import { UserEditCommand, UserOpenCommand, UserSaveCommand } from './transport';
import { UserEditComponent, UserContainerComponent, UserDetailsComponent } from './component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [UserEditComponent, UserDetailsComponent, UserContainerComponent];

@NgModule({
    imports: [
        CommonModule, 
        FormsModule, 
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatMenuModule,
        MatProgressBarModule,
        MatDatepickerModule,
        SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class UserModule extends TransportLazyModule<UserModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'UserModule';
    public static COMMANDS = [UserOpenCommand.NAME, UserEditCommand.NAME, UserSaveCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<UserModule>, transport: Transport, open: UserOpenHandler, edit: UserEditHandler, save: UserSaveHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return UserModule.ID;
    }

    public get commands(): Array<string> {
        return UserModule.COMMANDS;
    }
}
