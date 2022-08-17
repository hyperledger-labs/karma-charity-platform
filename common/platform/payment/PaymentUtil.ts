import { RandomUtil, TraceUtil, TransformUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { CoinObjectType } from '../../transport/command/coin';
import { IPaymentTarget, PaymentTarget } from './IPaymentTarget';
import { IsOptional, IsString, IsNumber, IsDefined, ValidateNested } from 'class-validator';
import { Ed25519 } from '@ts-core/common';

export class PaymentUtil {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public static createDetails(target: IPaymentTarget, privateKey: string, userId?: number): string {
        // let array = [target.type, target.id, RandomUtil.randomString(10)];
        let array = [target.type, target.id, TraceUtil.generate()];
        array.push(Ed25519.sign(array.join('/'), privateKey));
        if (!_.isNil(userId)) {
            array.push(userId);
        }
        return array.join('/');
    }

    public static parseDetails(item: string): PaymentAggregatorData {
        if (_.isEmpty(item)) {
            return null;
        }
        let array = item.split('/');
        let data = TransformUtil.toClass(PaymentAggregatorData, {
            target: {
                id: Number(array[1]),
                type: array[0] as CoinObjectType
            },
            signature: array[3],
            referenceId: array[2],
        });
        if (array.length === 5) {
            data.userId = Number(array[4]);
        }
        return data;
    }

    public static checkSignature(details: PaymentAggregatorData, privateKey: string): boolean {
        if (_.isNil(details) || _.isEmpty(privateKey)) {
            return false;
        }
        let array = [details.target.type, details.target.id, details.referenceId];
        let signature = Ed25519.sign(array.join('/'), privateKey);
        return signature === details.signature;
    }
}

export interface IPaymentAggregatorData {
    userId?: number;

    target: IPaymentTarget;
    signature: string;
    referenceId: string;
}

export class PaymentAggregatorData implements IPaymentAggregatorData {
    @IsDefined()
    @ValidateNested()
    target: PaymentTarget;

    @IsString()
    referenceId: string;

    @IsString()
    signature: string;

    @IsOptional()
    @IsNumber()
    userId?: number;
}