import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectPageRoutingModule } from './project-page.routing.module';
import { ProjectBalanceProgressComponent, ProjectPaymentTransactionComponent } from './component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ProjectPageComponent } from './project-page.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectModule } from '@feature/project';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatProgressBarModule,
        MatButtonModule,
        ProjectModule,
        ProjectPageRoutingModule,
    ],
    declarations: [ProjectPageComponent, ProjectBalanceProgressComponent, ProjectPaymentTransactionComponent]
})
export class ProjectPageModule { }
