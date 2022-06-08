import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { PipeService } from '@core/service';
import { LedgerBlockTransactionWrapper } from '@core/lib';
import * as _ from 'lodash';

@Component({
    selector: 'transaction',
    templateUrl: 'transaction.component.html'
})
export class TransactionComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _transaction: LedgerBlockTransaction;

    public name: string;
    public date: string;
    public isExecuted: boolean;

    public request: string;
    public requestUserId: string;

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

        value = this.pipe.momentDate.transform(transaction.createdDate);
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
        if (value !== this.requestUserId) {
            this.requestUserId = value;
        }

        value = transaction.requestData;
        if (value !== this.request) {
            this.request = value;
        }

        value = transaction.responseData;
        if (value !== this.response) {
            this.response = value;
        }

        value = transaction.isExecuted;
        if (value !== this.isExecuted) {
            this.isExecuted = value;
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
