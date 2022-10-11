import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LanguageService } from '@ts-core/frontend';
import { FinancePipe, PrettifyPipe } from '@ts-core/angular';
import { Accounts } from '@project/common/platform/account';
import { AmountPipe } from './AmountPipe';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Pipe({
    name: 'account'
})
export class AccountPipe extends DestroyableContainer implements PipeTransform {

    // --------------------------------------------------------------------------
    //
    //	Public Static
    //
    // --------------------------------------------------------------------------

    public static parseCoinId(item: string): string {
        switch (item) {
            case LedgerCoinId.RUB:
                return '₽';
            case LedgerCoinId.USD:
                return '$';
            case LedgerCoinId.EUR:
                return '€';
            default:
                return item;
        }
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

    constructor(private language: LanguageService) {
        super();
        this.finance = new FinancePipe();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(item: Accounts, emptySymbol?: string): string {
        if (_.isNil(item)) {
            return !_.isNil(emptySymbol) ? emptySymbol : PrettifyPipe.EMPTY_SYMBOL;
        }
        let items = [];
        for (let coinId in item) {
            items.push(`${this.finance.transform(AmountPipe.fromCent(item[coinId]))} ${AccountPipe.parseCoinId(coinId)}`);
        }
        return items.join(', ').trim();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
    }
}
