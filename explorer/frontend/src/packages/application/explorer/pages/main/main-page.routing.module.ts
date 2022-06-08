import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page.component';

const routes: Routes = [{ path: '', component: MainPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class MainPageRoutingModule {}
