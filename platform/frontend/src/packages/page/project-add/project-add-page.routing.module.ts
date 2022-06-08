import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@ts-core/angular';
import { ProjectAddPageComponent } from './project-add-page.component';

const routes: Routes = [{ path: '', component: ProjectAddPageComponent, canDeactivate: [CanDeactivateGuard] }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [CanDeactivateGuard],
    exports: [RouterModule]
})
export class ProjectAddPageRoutingModule { }
