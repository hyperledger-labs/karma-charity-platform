import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPageComponent } from './user-page.component';

const routes: Routes = [{ path: '', component: UserPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class UserPageRoutingModule { }
