import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LanguageService } from '@ts-core/frontend/language';
import { FinancePipe, PrettifyPipe } from '@ts-core/angular';
import { Accounts } from '@project/common/platform/account';
import { AmountPipe } from './AmountPipe';

@Pipe({
    name: 'account'
})
export class AccountPipe extends DestroyableContainer implements PipeTransform {

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

    public transform(item: Accounts): string {
        if (_.isNil(item)) {
            return PrettifyPipe.EMPTY_SYMBOL;
        }
        let items = [];
        for (let coinId in item) {
            items.push(`${this.finance.transform(AmountPipe.fromCent(item[coinId]))} ${coinId}`);
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
