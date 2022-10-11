
import { Loadable, LoadableEvent, LoadableStatus } from "@ts-core/common";
import { Client } from "@project/common/platform/api";
import * as _ from 'lodash';
import { DateUtil } from "@ts-core/common";
import { ObservableData } from "@ts-core/common";
import { Payment } from "@project/common/platform/payment";
import { ExtendedError } from "@ts-core/common";

export class PaymentReferenceLoader extends Loadable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _timer: any;
    private _payment: Payment;
    private _referenceId: string;

    private attempts: number;
    private maxAttempts: number = 30;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: Client) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private commitTimerProperties(): void {
        this.status = LoadableStatus.LOADING;
        this.observer.next(new ObservableData(LoadableEvent.STARTED));

        this.attempts = 0;
    }

    private commitReferenceIdProperties(): void {
        this._payment = null;
        this.timer = setInterval(this.check, 3 * DateUtil.MILISECONDS_SECOND);
    }

    private checkPayment(item: Payment): void {
        if (_.isNil(item)) {
            throw new ExtendedError(`Payment is nil`);
        }
        if (_.isEmpty(item.transactions)) {
            throw new ExtendedError(`No transactions in payment`);
        }
        if (item.transactions.some(transaction => _.isNil(transaction.ledgerTransaction))) {
            throw new ExtendedError(`Some transactions are not in blockchain`);
        }
    }

    private check = async (): Promise<void> => {
        try {
            this._payment = await this.api.paymentGetByReference(this.referenceId);
            this.checkPayment(this.payment);

            this.timer = null;
            this.status = LoadableStatus.LOADED;
            this.observer.next(new ObservableData(LoadableEvent.COMPLETE));
            this.observer.next(new ObservableData(LoadableEvent.FINISHED));
        }
        catch (error) {
            this.attempts++;
            if (this.attempts < this.maxAttempts) {
                return;
            }
            this.timer = null;
            this.status = LoadableStatus.ERROR;
            this.observer.next(new ObservableData(LoadableEvent.ERROR));
            this.observer.next(new ObservableData(LoadableEvent.FINISHED));
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.timer = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    private get timer(): any {
        return this._timer;
    }
    private set timer(value: any) {
        if (value === this._timer) {
            return;
        }
        if (!_.isNil(this.timer)) {
            clearInterval(this._timer);
        }
        this._timer = value;
        if (!_.isNil(value)) {
            this.commitTimerProperties();
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get payment(): Payment {
        return this._payment;
    }

    public set referenceId(value: string) {
        if (value === this._referenceId) {
            return;
        }
        this._referenceId = value;
        if (!_.isNil(value)) {
            this.commitReferenceIdProperties();
        }
    }
    public get referenceId(): string {
        return this._referenceId;
    }

}