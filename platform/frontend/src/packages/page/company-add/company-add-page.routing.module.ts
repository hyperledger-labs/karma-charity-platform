import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@ts-core/angular';
import { CompanyAddPageComponent } from './company-add-page.component';

const routes: Routes = [{ path: '', component: CompanyAddPageComponent, canDeactivate: [CanDeactivateGuard] }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [CanDeactivateGuard],
    exports: [RouterModule]
})
export class CompanyAddPageRoutingModule { }
