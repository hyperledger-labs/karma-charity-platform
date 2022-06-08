import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ISelectListItem, MenuTriggerForDirective, SelectListItem, SelectListItems, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { Payment } from '@project/common/platform/payment';
import { LanguageService } from '@ts-core/frontend/language';
import { PaymentMenu } from '../../service';
import { PaymentBaseComponent } from '../PaymentBaseComponent';

@Component({
    selector: 'payment-container',
    templateUrl: 'payment-container.component.html'
})
export class PaymentContainerComponent extends PaymentBaseComponent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;

    public tabs: SelectListItems<ISelectListItem<string>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef,
        language: LanguageService,
        public menu: PaymentMenu,
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex flex-column');

        this.tabs = new SelectListItems(language);
        this.tabs.add(new SelectListItem('payment.payment', 0, 'PAYMENT'));
        this.tabs.add(new SelectListItem('payment.transaction.transactions', 1, 'TRANSACTIONS'));
        this.tabs.complete(0);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async menuOpen(event: MouseEvent): Promise<void> {
        this.menu.refresh(this.payment);
        this.trigger.openMenuOn(event.target);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.payment = null;
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
        console.log(value);
    }

}
