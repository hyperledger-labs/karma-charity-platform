import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectsPageRoutingModule } from './projects-page.routing.module';
import { ProjectsPageComponent } from './projects-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../module/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, ProjectsPageRoutingModule],
    declarations: [ProjectsPageComponent]
})
export class ProjectsPageModule { }