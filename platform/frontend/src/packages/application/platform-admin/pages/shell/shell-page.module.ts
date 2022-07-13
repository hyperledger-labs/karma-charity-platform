import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShellPageRoutingModule } from './shell-page.routing.module';
import { ShellPageComponent } from './shell-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ShellHeaderComponent } from './component/shell-header/shell-header.component';
import { ShellMenu } from './service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';
import { ProfileModule } from '@feature/profile';

@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        ShellPageRoutingModule,
        SharedModule,
        ProfileModule
    ],
    declarations: [ShellPageComponent, ShellHeaderComponent],
    providers: [ShellMenu]
})
export class ShellPageModule { }
