import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TransactionsPageRoutingModule } from './transactions-page.routing.module';
import { TransactionsPageComponent } from './transactions-page.component';
import { MatButtonModule } from '@angular/material/button';
import { TransactionModule } from '@feature/transaction';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, MatButtonModule, SharedModule, TransactionsPageRoutingModule, TransactionModule],
    declarations: [TransactionsPageComponent]
})
export class TransactionsPageModule { }