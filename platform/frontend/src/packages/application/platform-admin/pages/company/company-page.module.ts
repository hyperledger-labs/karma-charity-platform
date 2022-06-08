import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanyPageRoutingModule } from './company-page.routing.module';
import { CompanyPageComponent } from './company-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../../../module/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyModule } from '../../../../module/feature/company';
import { PaymentModule } from '../../../../module/feature/payment';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, CompanyPageRoutingModule, CompanyModule, PaymentModule],
    declarations: [CompanyPageComponent]
})
export class CompanyPageModule { }