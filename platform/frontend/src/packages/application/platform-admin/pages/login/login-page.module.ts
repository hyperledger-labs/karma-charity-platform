import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginPageRoutingModule } from './login-page.routing.module';
import { LoginPageComponent } from './login-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { LoginModule } from '@feature/login';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, LoginPageRoutingModule, LoginModule],
    declarations: [LoginPageComponent]
})
export class LoginPageModule { }