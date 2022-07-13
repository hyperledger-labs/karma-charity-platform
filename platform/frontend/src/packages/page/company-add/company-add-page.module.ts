import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanyAddPageRoutingModule } from './company-add-page.routing.module';
import { CompanyAddPageComponent } from './company-add-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CompanyModule } from '@feature/company';

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
        CompanyAddPageRoutingModule,
        CompanyModule
    ],
    declarations: [CompanyAddPageComponent]
})
export class CompanyAddPageModule {}
