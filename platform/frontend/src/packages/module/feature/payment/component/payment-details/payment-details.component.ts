import { Component, Input, ViewContainerRef } from '@angular/core';
import { Payment } from '@project/common/platform/payment';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { PaymentBaseComponent } from '../PaymentBaseComponent';

@Component({
    selector: 'payment-details',
    templateUrl: 'payment-details.component.html'
})
export class PaymentDetailsComponent extends PaymentBaseComponent {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super(container);
        ViewUtil.addClasses(container, 'd-block');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get payment(): Payment {
        return super.payment;
    }
    @Input()
    public set payment(value: Payment) {
        super.payment = value;
    }
}
