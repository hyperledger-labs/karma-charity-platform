import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShellPageRoutingModule } from './shell-page.routing.module';
import { ShellPageComponent } from './shell-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ShellHeaderComponent } from './component/shell-header/shell-header.component';
import { ShellFooterComponent } from './component/shell-footer/shell-footer.component';
import { ShellHeaderMenu } from './service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        ShellPageRoutingModule,
        SharedModule
    ],
    declarations: [ShellPageComponent, ShellHeaderComponent, ShellFooterComponent],
    providers: [ShellHeaderMenu]
})
export class ShellPageModule {}
