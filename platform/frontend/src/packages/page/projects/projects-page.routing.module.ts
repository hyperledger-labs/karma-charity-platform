import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsPageComponent } from './projects-page.component';

const routes: Routes = [{ path: '', component: ProjectsPageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class ProjectsPageRoutingModule { }
