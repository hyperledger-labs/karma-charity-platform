import { Component, EventEmitter, Input, Output, ViewContainerRef } from '@angular/core';
import { ISelectListItem, IWindowContent, SelectListItem, SelectListItems, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { PipeService, UserService } from '@core/service';
import { Transport } from '@ts-core/common';
import { IPaymentAggregatorGetDtoResponse } from '@project/common/platform/api/payment';
import { Client } from '@project/common/platform/api';
import { Company } from '@project/common/platform/company';
import { CoinObjectType } from '@project/common/transport/command/coin';
import { IPaymentWidgetOpenDtoResponse, PaymentWidgetOpenCommand } from '../../transport';
import { IPaymentAggregatorData, PaymentTargetValue, PaymentUtil, PaymentWidgetDetails } from '@project/common/platform/payment';
import { ObjectUtil } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common';

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

    @Output()
    public failed: EventEmitter<ExtendedError> = new EventEmitter();
    @Output()
    public completed: EventEmitter<IPaymentAggregatorData> = new EventEmitter();

    protected _target: PaymentTargetValue;
    protected _details: PaymentWidgetDetails;
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

    protected commitDetailsProperties(): void {
        this.checkDetails();
        this.checkAutoOpen();
    }

    protected commitPaymentAggregatorProperties(): void {
        this.checkDetails();
        this.checkAutoOpen();
    }

    protected async load(): Promise<void> {
        if (this.isDisabled) {
            return;
        }
        this.isDisabled = true;
        try {
            this.paymentAggregator = await this.api.paymentAggregatorGet({
                id: this.target.id, type: this.target instanceof Company ? CoinObjectType.COMPANY : CoinObjectType.PROJECT
            });
            this.details = {};
        }
        finally {
            this.isDisabled = false;
        }
    }

    protected checkDetails(): void {
        if (_.isNil(this.details) || _.isNil(this.paymentAggregator)) {
            return;
        }

        ObjectUtil.copyPartial(this.details, this.paymentAggregator, ['coinId', 'coinIds', 'amount', 'amounts']);

        this.coinIds.clear();
        this.amounts.clear();

        if (!_.isEmpty(this.paymentAggregator.coinIds)) {
            this.paymentAggregator.coinIds.forEach((item, index) => this.coinIds.add(new SelectListItem(item, index, item)));
            this.coinIds.complete();
        }

        if (!_.isEmpty(this.paymentAggregator.amounts)) {
            this.paymentAggregator.amounts.forEach((item, index) => this.amounts.add(new SelectListItem(item.toString(), index, item)));
            this.amounts.complete();
        }
    }

    protected checkAutoOpen(): void {
        if (_.isNil(this.details) || _.isNil(this.paymentAggregator)) {
            return;
        }
        if (!_.isNil(this.details.coinId) && !_.isNil(this.details.amount)) {
            this.submit();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async submit(): Promise<void> {
        try {
            await this.transport.sendListen(new PaymentWidgetOpenCommand({
                amount: this.paymentAggregator.amount,
                coinId: this.paymentAggregator.coinId,

                data: this.details.data,

                target: this.paymentAggregator.target,
                details: this.paymentAggregator.details,
                aggregator: this.paymentAggregator.aggregator,
            }));
            this.completed.emit(PaymentUtil.parseDetails(this.paymentAggregator.details));
        } catch (error) {
            this.failed.emit(ExtendedError.create(error));
        }
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
    public get details(): PaymentWidgetDetails {
        return this._details;
    }
    @Input()
    public set details(value: PaymentWidgetDetails) {
        if (value === this._details) {
            return;
        }
        this._details = value;
        this.commitDetailsProperties();
    }
}
