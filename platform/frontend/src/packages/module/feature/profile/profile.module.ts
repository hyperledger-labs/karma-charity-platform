import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '@shared/shared.module';
import { ProfileInfoComponent } from './component/profile-info/profile-info.component';
import { ProfileMenu } from './service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TransportLazyModule } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { UserModule } from '../user';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [ProfileMenu];
const declarations = [ProfileInfoComponent];

@NgModule({
    imports: [
        CommonModule,

        MatButtonModule,
        MatMenuModule,
        MatProgressBarModule,
        UserModule,
        SharedModule
    ],
    exports: declarations,
    declarations,
    providers
})
export class ProfileModule extends TransportLazyModule<ProfileModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'ProfileModule';
    public static COMMANDS = [];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<ProfileModule>, transport: Transport) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return ProfileModule.ID;
    }

    public get commands(): Array<string> {
        return ProfileModule.COMMANDS;
    }
}
