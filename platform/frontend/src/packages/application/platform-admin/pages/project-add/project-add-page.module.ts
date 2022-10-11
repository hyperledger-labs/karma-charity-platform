import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectAddPageRoutingModule } from './project-add-page.routing.module';
import { ProjectAddPageComponent } from './project-add-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProjectModule } from '@feature/project';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatButtonModule,
        MatProgressBarModule,
        SharedModule,
        ProjectAddPageRoutingModule,
        ProjectModule
    ],
    declarations: [ProjectAddPageComponent]
})
export class ProjectAddPageModule {}
