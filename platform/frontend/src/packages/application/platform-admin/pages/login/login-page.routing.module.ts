import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

const routes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class LoginPageRoutingModule { }
