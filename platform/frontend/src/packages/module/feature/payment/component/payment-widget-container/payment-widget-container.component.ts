import { Component, Input, ViewContainerRef } from '@angular/core';
import { ISelectListItem, IWindowContent, SelectListItem, SelectListItems, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { PipeService, UserService } from '../../../../core/service';
import { Transport } from '@ts-core/common/transport';
import { IPaymentAggregatorGetDtoResponse } from '@project/common/platform/api/payment';
import { Client } from 'common/platform/api';
import { Company } from '@project/common/platform/company';
import { CoinObjectType } from 'common/transport/command/coin';
import { PaymentWidgetOpenCommand } from '../../transport';
import { PaymentTarget, PaymentTargetValue } from '@project/common/platform/payment';

@Component({
    selector: 'payment-widget-container',
    templateUrl: 'payment-widget-container.component.html'
})
export class PaymentWidgetContainer extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _target: PaymentTargetValue;
    protected _paymentAggregator: IPaymentAggregatorGetDtoResponse;

    public amounts: SelectListItems<ISelectListItem<number>>;
    public coinIds: SelectListItems<ISelectListItem<string>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef,
        private transport: Transport,
        private pipe: PipeService,
        private user: UserService,
        private api: Client,
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-block');

        this.amounts = new SelectListItems(pipe.language);
        this.coinIds = new SelectListItems(pipe.language);
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitTargetProperties(): void {
        this.load();
    }

    protected commitPaymentAggregatorProperties(): void {
        this.coinIds.clear();
        if (!_.isEmpty(this.paymentAggregator.coinIds)) {
            this.paymentAggregator.coinIds.forEach((item, index) => this.coinIds.add(new SelectListItem(item, index, item)));
            this.coinIds.complete(!_.isNil(this.paymentAggregator.coinId) ? this.paymentAggregator.coinId : 0);
        }
        this.amounts.clear();
        if (!_.isEmpty(this.paymentAggregator.amounts)) {
            this.paymentAggregator.amounts.forEach((item, index) => this.amounts.add(new SelectListItem(item.toString(), index, item)));
            this.amounts.complete(0);
        }
    }

    protected async load(): Promise<void> {
        if (this.isDisabled) {
            return;
        }
        this.isDisabled = true;
        try {
            this.paymentAggregator = await this.api.paymentAggregatorGet({
                id: this.target.id,
                type: this.target instanceof Company ? CoinObjectType.COMPANY : CoinObjectType.PROJECT
            })
        }
        finally {
            this.isDisabled = false;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public submit(): void {
        this.transport.send(new PaymentWidgetOpenCommand({
            amount: this.amounts.selectedData,
            coinId: this.coinIds.selectedData,

            target: this.paymentAggregator.target,
            details: this.paymentAggregator.details,
            aggregator: this.paymentAggregator.aggregator,
        }))
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.amounts)) {
            this.amounts.destroy();
            this.amounts = null;
        }
        if (!_.isNil(this.coinIds)) {
            this.coinIds.destroy();
            this.coinIds = null;
        }

        this.target = null;
        this.paymentAggregator = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get target(): PaymentTargetValue {
        return this._target;
    }
    @Input()
    public set target(value: PaymentTargetValue) {
        if (value === this._target) {
            return;
        }
        this._target = value;
        if (!_.isNil(value)) {
            this.commitTargetProperties();
        }
    }

    public get paymentAggregator(): IPaymentAggregatorGetDtoResponse {
        return this._paymentAggregator;
    }
    @Input()
    public set paymentAggregator(value: IPaymentAggregatorGetDtoResponse) {
        if (value === this._paymentAggregator) {
            return;
        }
        this._paymentAggregator = value;
        if (!_.isNil(value)) {
            this.commitPaymentAggregatorProperties();
        }
    }

}
