import { PaymentType } from '../PaymentType';
import { PaymentPeriod } from '../PaymentPeriod';

export interface ICreateDonateDto {
    amount: number;
    type: PaymentType;
    period?: PaymentPeriod;
    comment?: string;
}
