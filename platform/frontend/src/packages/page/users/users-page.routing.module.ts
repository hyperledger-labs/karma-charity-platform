import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersPageComponent } from './users-page.component';

const routes: Routes = [{ path: '', component: UsersPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class UsersPageRoutingModule { }
