import * as _ from 'lodash';
import { IPaymentTarget, PaymentTarget } from "@project/common/platform/payment";
import { CoinObjectType } from '@project/common/transport/command/coin';
import { IsNumber, IsOptional, IsString, ValidateNested, IsDefined, IsEnum } from "class-validator";
import { TransformUtil } from '@ts-core/common/util';

export class PaymentUtil {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static createDetails(item: IPaymentAggregatorData): string {
        let value = `${item.target.type}/${item.target.id}`;
        if (!_.isNil(item.userId)) {
            value += `/${item.userId}`;
        }
        return value;
    }

    public static parseDetails(item: string): PaymentAggregatorData {
        if (_.isEmpty(item)) {
            return null;
        }
        let array = item.split('/');
        return TransformUtil.toClass(PaymentAggregatorData, {
            target: {
                id: Number(array[1]),
                type: array[0] as CoinObjectType
            },
            userId: Number(array[2])
        });
    }

}

export interface IPaymentAggregatorData {
    target: IPaymentTarget;
    userId?: number;
}

export class PaymentAggregatorData implements IPaymentAggregatorData {
    @IsDefined()
    @ValidateNested()
    target: PaymentTarget;

    @IsOptional()
    @IsNumber()
    userId?: number;
}