import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TransportLazyModule } from '@ts-core/angular';
import { CompanyAddHandler, CompanyUserAddHandler, CompanyToVerifyHandler, CompanyUserRoleEditHandler, CompanyVerifyHandler, CompanyRejectHandler, CompanyActivateHandler } from './service';
import { Transport } from '@ts-core/common/transport';
import { CompanyActivateCommand, CompanyAddCommand, CompanyEditCommand, CompanyOpenCommand, CompanyRejectCommand, CompanyToVerifyCommand, CompanyUserRoleEditCommand, CompanyVerifyCommand } from './transport';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CompanyAddComponent, CompanyUserRoleEditComponent, CompanyUsersComponent, CompanyNalogPreferencesComponent, CompanyContainerComponent, CompanyDetailsComponent, CompanyUserAddComponent, CompanyEditComponent } from './component';
import { CompanyOpenHandler } from './service/CompanyOpenHandler';
import { PaymentModule } from '@feature/payment';
import { CompanyEditHandler } from './service/CompanyEditHandler';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [CompanyAddComponent, CompanyEditComponent, CompanyUserAddComponent, CompanyContainerComponent, CompanyUserRoleEditComponent, CompanyUsersComponent, CompanyNalogPreferencesComponent, CompanyDetailsComponent];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatExpansionModule,
        MatMenuModule,
        MatProgressBarModule,
        MatDatepickerModule,
        CKEditorModule,
        PaymentModule,
        SharedModule
    ],
    exports: declarations,
    declarations,
    providers
})
export class CompanyModule extends TransportLazyModule<CompanyModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'CompanyModule';
    public static COMMANDS = [CompanyAddCommand.NAME, CompanyEditCommand.NAME, CompanyToVerifyCommand.NAME, CompanyRejectCommand.NAME, CompanyVerifyCommand.NAME, CompanyActivateCommand.NAME, CompanyUserRoleEditCommand.NAME, CompanyOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        reference: NgModuleRef<CompanyModule>,
        transport: Transport,
        add: CompanyAddHandler,
        edit: CompanyEditHandler,
        open: CompanyOpenHandler,
        verify: CompanyVerifyHandler,
        reject: CompanyRejectHandler,
        toVerify: CompanyToVerifyHandler,
        activate: CompanyActivateHandler,
        userAdd: CompanyUserAddHandler,
        userRoleEdit: CompanyUserRoleEditHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return CompanyModule.ID;
    }

    public get commands(): Array<string> {
        return CompanyModule.COMMANDS;
    }
}
