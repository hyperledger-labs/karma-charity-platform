import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentsPageRoutingModule } from './payments-page.routing.module';
import { PaymentsPageComponent } from './payments-page.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { PaymentModule } from '@feature/payment';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatMenuModule, SharedModule, PaymentsPageRoutingModule, PaymentModule],
    declarations: [PaymentsPageComponent]
})
export class PaymentsPageModule { }