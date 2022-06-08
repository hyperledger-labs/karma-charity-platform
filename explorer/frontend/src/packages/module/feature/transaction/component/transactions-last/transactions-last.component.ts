import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockTransaction, LedgerInfo } from '@hlf-explorer/common/ledger';
import { Transport } from '@ts-core/common/transport';
import { TransactionsOpenCommand, TransactionOpenCommand } from '../../transport';

@Component({
    selector: 'transactions-last',
    templateUrl: 'transactions-last.component.html'
})
export class TransactionsLastComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _ledger: LedgerInfo;

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
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitLedgerProperties(): void {}

        //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public transactionOpen(item: LedgerBlockTransaction): void {
        this.transport.send(new TransactionOpenCommand(item));
    }
    
    public transactionsOpen(): void {
        this.transport.send(new TransactionsOpenCommand());
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get ledger(): LedgerInfo {
        return this._ledger;
    }

    @Input()
    public set ledger(value: LedgerInfo) {
        if (value === this._ledger) {
            return;
        }
        this._ledger = value;
        if (this._ledger) {
            this.commitLedgerProperties();
        }
    }
}
