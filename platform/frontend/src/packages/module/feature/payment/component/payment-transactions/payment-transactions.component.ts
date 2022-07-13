import { Component, Input, ViewContainerRef } from '@angular/core';
import { ICdkTableCellEvent, ICdkTableSettings, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { PaymentBaseComponent } from '../PaymentBaseComponent';
import { PaymentTransactionMapCollection, PaymentTransactionTableSettings } from '@core/lib/payment';
import { PipeService, UserService } from '@core/service';
import { Transport } from '@ts-core/common/transport';
import { Payment, PaymentTransaction } from '@project/common/platform/payment';
import { PaymentOpenCommand } from '../../transport';
import { FilterableConditions } from '@ts-core/common/dto';
import { ObjectUtil } from '@ts-core/common/util';
import { CompanyOpenCommand } from '@feature/company/transport';
import { ProjectOpenCommand } from '@feature/project/transport';

@Component({
    selector: 'payment-transactions',
    templateUrl: 'payment-transactions.component.html',
    providers: [PaymentTransactionMapCollection]
})
export class PaymentTransactionsComponent extends PaymentBaseComponent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public settings: ICdkTableSettings<PaymentTransaction>;
    private _conditions: FilterableConditions<PaymentTransaction>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef,
        pipe: PipeService,
        user: UserService,
        private transport: Transport,
        public items: PaymentTransactionMapCollection
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex');

        this.settings = new PaymentTransactionTableSettings(pipe, user);
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitConditionsProperties(): void {
        ObjectUtil.copyPartial(this.conditions, this.items.conditions);
        this.items.reload();
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<PaymentTransaction>): Promise<void> {
        switch (item.column) {
            case PaymentTransactionTableSettings.COLUMN_NAME_TARGET:
                if (!_.isNil(item.data.companyId)) {
                    this.transport.send(new CompanyOpenCommand(item.data.companyId));
                } else if (!_.isNil(item.data.projectId)) {
                    this.transport.send(new ProjectOpenCommand(item.data.projectId));
                } else {
                    this.transport.send(new PaymentOpenCommand(item.data.paymentId));
                }
                break;

            default:
                this.transport.send(new PaymentOpenCommand(item.data.paymentId));
        }
    }
    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.items)) {
            this.items.destroy();
            this.items = null;
        }

        this.settings = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get conditions(): FilterableConditions<PaymentTransaction> {
        return this._conditions;
    }
    @Input()
    public set conditions(value: FilterableConditions<PaymentTransaction>) {
        if (value === this._conditions) {
            return;
        }
        this._conditions = value;
        if (!_.isNil(value)) {
            this.commitConditionsProperties();
        }
    }

}
