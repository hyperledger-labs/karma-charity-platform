
import { IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse } from "../../transport";
import { PaymentAggregatorManager } from "../PaymentAggregatorManager";
import { IPaymentAggregatorGetDtoResponse } from "@project/common/platform/api/payment";
import * as _ from 'lodash';
import { PromiseHandler } from "@ts-core/common/promise";
import { ExtendedError } from "@ts-core/common/error";
import { CoinObjectType } from "common/transport/command/coin";

export class CloudPaymentsAggregator extends PaymentAggregatorManager {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super('//widget.cloudpayments.ru/bundles/cloudpayments.js');
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async open(item: IPaymentWidgetOpenDto): Promise<IPaymentWidgetOpenDtoResponse> {
        await this.script.load();

        let options = {
            amount: item.amount,
            publicId: item.aggregator.uid,
            currency: item.coinId,
            accountId: item.details,
            description: this.pipe.language.translate(`payment.description.${item.target.type === CoinObjectType.COMPANY ? 'company' : 'project'}`, { name: item.target.value.preferences.title }),
            email: null
        }

        if (!_.isNil(this.user.preferences)) {
            options.email = this.user.preferences.email;
        }

        let promise = PromiseHandler.create<IPaymentWidgetOpenDtoResponse, ExtendedError>();
        let widget = new window['cp'].CloudPayments();
        widget.pay('charge', options,
            {
                onFail: (reason, options) => {
                    promise.reject(new ExtendedError(reason));
                },
                onSuccess: (options) => promise.resolve({}),
                onComplete: (result, options) => {
                    if (result.success) {
                        promise.resolve({});
                    }
                    else {
                        promise.reject(new ExtendedError(`Unable to make payment code "${result.code}"`))
                    }
                }
            });
        return promise.promise;
    }
}