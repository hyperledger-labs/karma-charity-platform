import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyPageComponent } from './company-page.component';

const routes: Routes = [{ path: '', component: CompanyPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class CompanyPageRoutingModule { }
