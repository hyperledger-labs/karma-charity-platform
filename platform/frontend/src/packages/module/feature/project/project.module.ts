import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TransportLazyModule } from '@ts-core/angular';
import { ProjectAddHandler, ProjectToVerifyHandler, ProjectOpenHandler, ProjectVerifyHandler, ProjectRejectHandler, ProjectActivateHandler, ProjectUserRoleEditHandler, ProjectPurposeAddHandler, ProjectUserAddHandler, ProjectEditHandler } from './service';
import { Transport } from '@ts-core/common/transport';
import { ProjectActivateCommand, ProjectAddCommand, ProjectOpenCommand, ProjectRejectCommand, ProjectToVerifyCommand, ProjectVerifyCommand, ProjectUserRoleEditCommand, ProjectPurposeAddCommand, ProjectUserAddCommand, ProjectEditCommand } from './transport';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProjectAddComponent, ProjectEditComponent, ProjectUserAddComponent, ProjectFilesComponent, ProjectContainerComponent, ProjectPurposesComponent, ProjectDetailsComponent, ProjectUsersComponent, ProjectUserRoleEditComponent, ProjectPurposeAddComponent } from './component';
import { PaymentModule } from '../payment';
import { ProjectTagPipe } from './pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [ProjectTagPipe, ProjectUserAddComponent, ProjectEditComponent, ProjectAddComponent, ProjectPurposesComponent, ProjectPurposeAddComponent, ProjectDetailsComponent, ProjectContainerComponent, ProjectUsersComponent, ProjectUserRoleEditComponent, ProjectFilesComponent];

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
export class ProjectModule extends TransportLazyModule<ProjectModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'ProjectModule';
    public static COMMANDS = [ProjectAddCommand.NAME, ProjectEditCommand.NAME, ProjectUserAddCommand.NAME, ProjectPurposeAddCommand.NAME, ProjectToVerifyCommand.NAME, ProjectRejectCommand.NAME, ProjectVerifyCommand.NAME, ProjectActivateCommand.NAME, ProjectOpenCommand.NAME, ProjectUserRoleEditCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<ProjectModule>,
        transport: Transport,
        add: ProjectAddHandler,
        edit: ProjectEditHandler,
        toVerify: ProjectToVerifyHandler,
        verify: ProjectVerifyHandler,
        reject: ProjectRejectHandler,
        activate: ProjectActivateHandler,
        open: ProjectOpenHandler,
        purposeAdd: ProjectPurposeAddHandler,
        userAdd: ProjectUserAddHandler,
        userRoleEdit: ProjectUserRoleEditHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return ProjectModule.ID;
    }

    public get commands(): Array<string> {
        return ProjectModule.COMMANDS;
    }
}
