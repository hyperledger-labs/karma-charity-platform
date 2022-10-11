import { IsNumber, IsEnum } from "class-validator";
import { CoinObjectType } from "../../transport/command/coin";
import { Company } from "../company";
import { Project } from "../project";
import { Type } from 'class-transformer';

export interface IPaymentTarget {
    id: number;
    type: CoinObjectType;
    value?: PaymentTargetValue;
}

export class PaymentTarget implements IPaymentTarget {
    @IsNumber()
    id: number;

    @IsEnum(CoinObjectType)
    type: CoinObjectType;

    @Type((item) => item.object.type === CoinObjectType.COMPANY ? Company : Project)
    value?: PaymentTargetValue;
}

export type PaymentTargetValue = Company | Project;