import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TransactionPageRoutingModule } from './transaction-page.routing.module';
import { TransactionPageComponent } from './transaction-page.component';
import { MatButtonModule } from '@angular/material/button';
import { TransactionModule } from '@feature/transaction';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, TransactionPageRoutingModule, TransactionModule],
    declarations: [TransactionPageComponent]
})
export class TransactionPageModule {}