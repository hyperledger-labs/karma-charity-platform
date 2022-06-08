import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockTransactionMapCollection } from '@core/lib/';
import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { Transport } from '@ts-core/common/transport';
import { TransactionOpenCommand } from '../../transport';

@Component({
    selector: 'transactions',
    templateUrl: 'transactions.component.html'
})
export class TransactionsComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @Input()
    public transactions: LedgerBlockTransactionMapCollection;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, private transport: Transport) {
        super();
        ViewUtil.addClasses(element, 'd-block');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public transactionOpen(item: LedgerBlockTransaction): void {
        this.transport.send(new TransactionOpenCommand(item));
    }
}
