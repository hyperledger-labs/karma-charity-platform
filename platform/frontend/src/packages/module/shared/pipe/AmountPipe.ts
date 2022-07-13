import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { FinancePipe, PrettifyPipe } from '@ts-core/angular';
import { MathUtil } from '@ts-core/common/util';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Pipe({
    name: 'amount'
})
export class AmountPipe extends DestroyableContainer implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static toCent(amount: string): string {
        return MathUtil.multiply(amount, '100');
    }

    public static fromCent(amount: string): string {
        return MathUtil.divide(amount, '100');
    }

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private finance: FinancePipe;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this.finance = new FinancePipe();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(item: IAmount): string {
        if (_.isNil(item)) {
            return PrettifyPipe.EMPTY_SYMBOL;
        }
        return `${this.finance.transform(AmountPipe.fromCent(item.amount))} ${item.coinId}`;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.finance = null;
    }
}

export interface IAmount {
    amount: string;
    coinId: LedgerCoinId;
}
