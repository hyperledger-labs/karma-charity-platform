import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LanguageService } from '@ts-core/frontend/language';
import { FinancePipe, PrettifyPipe } from '@ts-core/angular';
import { MathUtil } from '@ts-core/common/util';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { Payment } from '@project/common/platform/payment';
import { AmountPipe } from '@shared/pipe';

@Pipe({
    name: 'paymentAmount'
})
export class PaymentAmountPipe extends DestroyableContainer implements PipeTransform {

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private amount: AmountPipe;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this.amount = new AmountPipe();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(item: Payment): string {
        if (_.isNil(item) || _.isEmpty(item.transactions)) {
            return PrettifyPipe.EMPTY_SYMBOL;
        }
        let amount = '0';
        let coinId = null;
        for (let transaction of item.transactions) {
            coinId = transaction.coinId;
            amount = MathUtil.add(amount, transaction.amount);
        }
        return this.amount.transform({ amount, coinId });
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.amount = null;
    }
}

