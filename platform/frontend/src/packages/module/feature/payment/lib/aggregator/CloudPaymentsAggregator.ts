
import { IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse } from "../../transport";
import { PaymentAggregatorManager } from "../PaymentAggregatorManager";
import { IPaymentAggregatorGetDtoResponse } from "@project/common/platform/api/payment";
import * as _ from 'lodash';
import { PromiseHandler } from "@ts-core/common";
import { ExtendedError } from "@ts-core/common";
import { CoinObjectType } from "@project/common/transport/command/coin";
import { NativeWindowService } from "@ts-core/frontend";

export class CloudPaymentsAggregator extends PaymentAggregatorManager {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private nativeWindow: NativeWindowService) {
        super('//widget.cloudpayments.ru/bundles/cloudpayments.js');
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async getApi(): Promise<any> {
        await this.script.load();
        return this.nativeWindow.window['cp']
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async open(item: IPaymentWidgetOpenDto): Promise<IPaymentWidgetOpenDtoResponse> {
        let api = await this.getApi();

        let email = this.getEmail();
        let accountId = `${item.target.id}/${item.target.type}`;
        let description = this.getDescription(item.target);

        let data = this.getDataParam(item.data, 'data', {} as any);
        data.karmaDetails = item.details;

        let options = {
            amount: item.amount,
            publicId: item.aggregator.uid,
            currency: item.coinId,

            skin: this.getDataParam(item.data, 'skin', 'classic'),
            email: this.getDataParam(item.data, 'email', email),
            invoiceId: this.getDataParam(item.data, 'invoiceId'),
            accountId: this.getDataParam(item.data, 'accountId', accountId),
            description: this.getDataParam(item.data, 'description', description),
            retryPayment: this.getDataParam(item.data, 'retryPayment', true),
            requireEmail: this.getDataParam(item.data, 'requireEmail', false),
            data
        }

        let promise = PromiseHandler.create<IPaymentWidgetOpenDtoResponse, ExtendedError>();
        let widget = new api.CloudPayments();
        widget.pay('charge', options, {
            onFail: (reason, options) => {
                promise.reject(new ExtendedError(reason, null, options));
            },
            onSuccess: (options) => {
                promise.resolve(options)
            },
            onComplete: (result, options) => {
                if (result.success) {
                    promise.resolve(options);
                }
                else {
                    promise.reject(new ExtendedError(`Unable to make payment code "${result.code}"`))
                }
            }
        });
        return promise.promise;
    }
}