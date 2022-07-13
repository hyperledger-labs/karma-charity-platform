import { CdkTablePaginableMapCollection, ICdkTableColumn, ICdkTableSettings, PrettifyPipe } from '@ts-core/angular';
import * as _ from 'lodash';
import { PipeService, UserService } from '@core/service';
import { Injectable } from '@angular/core';
import { Payment, PaymentTransaction } from '@project/common/platform/payment';
import { IPagination } from '@ts-core/common/dto';
import { Client } from '@project/common/platform/api';

@Injectable()
export class PaymentTransactionMapCollection extends CdkTablePaginableMapCollection<PaymentTransaction, PaymentTransaction> {

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _payment: Payment;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: Client) {
        super(`id`);
        this.sort.createdDate = false;
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    private commitPaymentProperties(): void {
        this.reload();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isNeedClearAfterLoad(): boolean {
        return true;
    }

    protected async request(): Promise<IPagination<PaymentTransaction>> {
        if (_.isNil(this.payment)) {
            return this.api.paymentTransactionList(this.createRequestData());
        }
        return {
            items: this.payment.transactions,
            pages: 1,
            total: 1,
            pageIndex: 0,
            pageSize: this.payment.transactions.length
        }
    }

    protected parseItem(item: PaymentTransaction): PaymentTransaction {
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.payment = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get payment(): Payment {
        return this._payment;
    }
    public set payment(value: Payment) {
        if (value === this._payment) {
            return;
        }
        this._payment = value;
        if (!_.isNil(value)) {
            this.commitPaymentProperties();
        }
    }
}

export class PaymentTransactionTableSettings implements ICdkTableSettings<PaymentTransaction> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public columns: Array<ICdkTableColumn<PaymentTransaction>>;
    public static COLUMN_NAME_TARGET = 'target';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(pipe: PipeService, user: UserService) {
        this.columns = [];
        this.columns.push({
            name: 'type',
            className: 'ps-3',
            headerClassName: 'ps-3',
            headerId: 'payment.transaction.type.type',
            format: item => pipe.language.translate(`payment.transaction.type.${item.type}`)
        })
        this.columns.push({
            name: 'amount',
            headerId: 'payment.transaction.amount',
            format: item => pipe.amount.transform(item)
        })
        this.columns.push({
            name: PaymentTransactionTableSettings.COLUMN_NAME_TARGET,
            headerId: 'payment.transaction.target',
            isDisableSort: true,
            format: item => {
                if (!_.isNil(item.company)) {
                    return item.company.preferences.nameShort;
                }
                if (!_.isNil(item.project)) {
                    return item.project.preferences.title;
                }
                return PrettifyPipe.EMPTY_SYMBOL;
            }
        })
        this.columns.push({
            name: 'activatedDate',
            headerId: 'payment.transaction.activatedDate',
            format: item => pipe.momentDate.transform(item.activatedDate)
        });

    }
}
