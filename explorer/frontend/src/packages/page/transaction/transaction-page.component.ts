import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewUtil } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LedgerBlock, LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { takeUntil } from 'rxjs';

@Component({
    templateUrl: './transaction-page.component.html'
})
export class TransactionPageComponent extends DestroyableContainer {

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _transaction: LedgerBlockTransaction;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ElementRef, route: ActivatedRoute) {
        super();
        ViewUtil.addClasses(container, 'd-block');
        route.data.pipe(takeUntil(this.destroyed)).subscribe(data => this._transaction = data.transaction);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get transaction(): LedgerBlockTransaction {
        return this._transaction;
    }
}
