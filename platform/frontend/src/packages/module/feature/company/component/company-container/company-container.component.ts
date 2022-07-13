import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ISelectListItem, MenuTriggerForDirective, SelectListItem, SelectListItems, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { CompanyMenu } from '@feature/company/service';
import { LanguageService } from '@ts-core/frontend/language';
import { CompanyBaseComponent } from '../CompanyBaseComponent';
import { UserCompany } from '@project/common/platform/user';
import { PaymentMapCollection, PaymentTransactionMapCollection } from '@core/lib/payment';

@Component({
    selector: 'company-container',
    templateUrl: 'company-container.component.html',
    providers: [PaymentMapCollection]
})
export class CompanyContainerComponent extends CompanyBaseComponent {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;

    public tabs: SelectListItems<ISelectListItem<string>>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        language: LanguageService,
        public payments: PaymentTransactionMapCollection,
        public menu: CompanyMenu,
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex flex-column');

        this.tabs = new SelectListItems(language);
        this.tabs.add(new SelectListItem('company.company', 0, 'COMPANY'));
        this.tabs.add(new SelectListItem('user.users', 1, 'USERS'));
        this.tabs.add(new SelectListItem('payment.payment', 2, 'PAYMENTS'));
        this.tabs.add(new SelectListItem('payment.donate', 3, 'DONATE'));
        this.tabs.complete(0);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitCompanyProperties(): void {
        this.payments.conditions.companyId = this.company.id;
        this.payments.reload();
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async menuOpen(event: MouseEvent): Promise<void> {
        this.menu.refresh(this.company);
        this.trigger.openMenuOn(event.target);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get company(): UserCompany {
        return super.company;
    }
    @Input()
    public set company(value: UserCompany) {
        super.company = value;
    }

}
