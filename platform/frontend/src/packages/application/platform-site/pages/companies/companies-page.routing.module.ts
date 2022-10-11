import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesPageComponent } from './companies-page.component';

const routes: Routes = [{ path: '', component: CompaniesPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class CompaniesPageRoutingModule { }
