import { Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import { PipeService, UserService } from '../../module/core/service';
import * as _ from 'lodash';
import { PaymentTransactionMapCollection, PaymentTransactionTableSettings } from '../../module/core/lib/payment';
import { PaymentMenu } from '../../module/feature/payment/service';
import { Transport } from '@ts-core/common/transport';
import { PaymentOpenCommand } from '../../module/feature/payment/transport';
import { Payment, PaymentTransaction } from '@project/common/platform/payment';

@Component({
    templateUrl: 'payments-page.component.html',
})
export class PaymentsPageComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    public settings: ICdkTableSettings<PaymentTransaction>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ElementRef,
        pipe: PipeService,
        user: UserService,
        private transport: Transport,
        public menu: PaymentMenu,
        public items: PaymentTransactionMapCollection
    ) {
        super();
        ViewUtil.addClasses(element, 'd-block');
        this.settings = new PaymentTransactionTableSettings(pipe, user);
    }
}
