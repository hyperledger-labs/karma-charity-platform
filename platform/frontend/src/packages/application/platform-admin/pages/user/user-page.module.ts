import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserPageRoutingModule } from './user-page.routing.module';
import { UserPageComponent } from './user-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { UserModule } from '@feature/user';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, UserPageRoutingModule, UserModule],
    declarations: [UserPageComponent]
})
export class UserPageModule { }