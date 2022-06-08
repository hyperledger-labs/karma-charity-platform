import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/shared.module';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TransportLazyModule } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { UserModule } from '../user';
import { ProfileQuizComponent } from './component/profile-quiz/profile-quiz.component';
import { ProfileQuizOpenCommand } from './transport';
import { ProfileQuizOpenHandler } from './service';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [ProfileQuizComponent];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        UserModule,
        SharedModule
    ],
    exports: declarations,
    declarations,
    providers
})
export class ProfileQuizModule extends TransportLazyModule<ProfileQuizModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'ProfileQuizModule';
    public static COMMANDS = [ProfileQuizOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<ProfileQuizModule>, transport: Transport, open: ProfileQuizOpenHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return ProfileQuizModule.ID;
    }

    public get commands(): Array<string> {
        return ProfileQuizModule.COMMANDS;
    }
}
