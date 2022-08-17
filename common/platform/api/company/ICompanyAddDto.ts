
import { ITraceable } from '@ts-core/common';
import { CompanyPreferences } from '../../company';
import { PaymentAggregator } from '../../payment/aggregator';
import { UserCompany } from '../../user';

export interface ICompanyAddDto extends ITraceable {
    preferences: Partial<CompanyPreferences>;
    paymentAggregator: Partial<PaymentAggregator>;
}
export declare type ICompanyAddDtoResponse = UserCompany;
