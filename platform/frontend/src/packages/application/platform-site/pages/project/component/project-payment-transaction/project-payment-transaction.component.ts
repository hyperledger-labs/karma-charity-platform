import { Component, Input, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { Assets, LanguageService } from '@ts-core/frontend';
import { UserPreferences, UserProject } from '@project/common/platform/user';
import { DestroyableContainer, MathUtil } from '@ts-core/common';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { PaymentTransaction } from '@project/common/platform/payment';
import { PipeService } from '@core/service';

@Component({
    selector: 'project-payment-transaction',
    styleUrls: ['project-payment-transaction.component.scss'],
    templateUrl: 'project-payment-transaction.component.html',
})
export class ProjectPaymentTransactionComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _paymentTransaction: PaymentTransaction;

    public amount: string;

    public title: string;
    public picture: string;
    public description: string;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(container: ViewContainerRef, private pipe: PipeService) {
        super();
        ViewUtil.addClasses(container, 'd-flex align-items-center');
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitPaymentTransactionProperties(): void {
        let value = null;

        value = `+${this.pipe.amount.transform(this.paymentTransaction)}`;
        if (value !== this.amount) {
            this.amount = value;
        }

        value = this.getUserPreference('picture', Assets.getIcon('72'));
        if (value !== this.picture) {
            this.picture = value;
        }
        value = this.getUserPreference('location', this.pipe.language.translate('general.anonymousPayment'));
        if (value !== this.title) {
            this.title = value;
        }

        value = this.getUserPreference('location', this.pipe.language.translate('general.unknown'));
        if (value !== this.description) {
            this.description = value;
        }
    }

    private getUserPreference(name: string, defaultValue: string): string {
        let user = this.paymentTransaction.payment.user;
        if (_.isNil(user) || _.isNil(user.preferences)) {
            return defaultValue;
        }
        if (_.isEmpty(user.preferences[name])) {
            return defaultValue;
        }
        return user.preferences[name];
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.paymentTransaction = null;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get paymentTransaction(): PaymentTransaction {
        return this._paymentTransaction;
    }
    @Input()
    public set paymentTransaction(value: PaymentTransaction) {
        if (value === this._paymentTransaction) {
            return;
        }
        this._paymentTransaction = value;
        if (!_.isNil(value)) {
            this.commitPaymentTransactionProperties();
        }
    }
}
