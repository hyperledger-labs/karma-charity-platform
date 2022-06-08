import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { TransactionOpenHandler, TransactionsOpenHandler, } from './service';
import { TransportLazyModule } from '@ts-core/angular';
import { TransactionOpenCommand, TransactionsOpenCommand } from './transport';
import { Transport } from '@ts-core/common/transport';
import { TransactionComponent } from './component/transaction/transaction.component';
import { TransactionsComponent } from './component/transactions/transactions.component';
import { TransactionLastComponent } from './component/transaction-last/transaction-last.component';
import { TransactionDetailsComponent } from './component/transaction-details/transaction-details.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { TransactionsLastComponent } from './component/transactions-last/transactions-last.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [TransactionComponent, TransactionDetailsComponent, TransactionLastComponent, TransactionsComponent, TransactionsLastComponent];

@NgModule({
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatProgressBarModule, MatTabsModule ,SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class TransactionModule extends TransportLazyModule<TransactionModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'TransactionModule';
    public static COMMANDS = [TransactionOpenCommand.NAME, TransactionsOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<TransactionModule>, transport: Transport, open: TransactionOpenHandler, opens: TransactionsOpenHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return TransactionModule.ID;
    }

    public get commands(): Array<string> {
        return TransactionModule.COMMANDS;
    }
}
