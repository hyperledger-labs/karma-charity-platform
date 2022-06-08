

import { Payment } from "@project/common/platform/payment";
import { IWindowContent } from "@ts-core/angular";
import * as _ from 'lodash';

export abstract class PaymentBaseComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _payment: Payment;

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    protected commitPaymentProperties(): void { }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.payment = null;
    }
    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

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