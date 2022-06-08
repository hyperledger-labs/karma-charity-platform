import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { PipeService } from '@core/service';
import * as _ from 'lodash';
import { LedgerBlockTransactionWrapper } from '@core/lib';

@Component({
    selector: 'transaction-last',
    templateUrl: 'transaction-last.component.html'
})
export class TransactionLastComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _transaction: LedgerBlockTransaction;

    public name: string;
    public date: string;
    public userId: string;
    public status: string;
    public isExecuted: boolean;

    public request: string;
    public response: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, private pipe: PipeService) {
        super();
        ViewUtil.addClasses(element, 'd-flex flex-grow-1 align-items-center');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitTransactionProperties(): void {
        let value = null;

        let transaction = new LedgerBlockTransactionWrapper(this.transaction);

        value = this.pipe.momentDateFromNow.transform(transaction.createdDate, null);
        if (value !== this.date) {
            this.date = value;
        }

        value = transaction.requestName;
        if (transaction.isBatch) {
            value = this.pipe.language.translate('block.batch.batch');
        }
        if (value !== this.name) {
            this.name = value;
        }

        value = transaction.requestUserId;
        if (value !== this.userId) {
            this.userId = value;
        }

        value = transaction.isExecuted;
        if (value !== this.isExecuted) {
            this.isExecuted = value;
        }

        value = transaction.isExecuted ? '✔' : '✘';
        if (value !== this.status) {
            this.status = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get transaction(): LedgerBlockTransaction {
        return this._transaction;
    }
    @Input()
    public set transaction(value: LedgerBlockTransaction) {
        if (value === this._transaction) {
            return;
        }
        this._transaction = value;
        if (this._transaction) {
            this.commitTransactionProperties();
        }
    }
}
