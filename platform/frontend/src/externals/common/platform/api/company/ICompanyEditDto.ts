
import { ITraceable } from '@ts-core/common';
import { CompanyPreferences, CompanyStatus } from '../../company';
import { PaymentAggregator } from '../../payment/aggregator';
import { UserCompany } from '../../user';

export interface ICompanyEditDto extends ITraceable {
    id?: number;
    status?: CompanyStatus;
    preferences?: Partial<CompanyPreferences>;
    paymentAggregator?: Partial<PaymentAggregator>;
}
export declare type ICompanyEditDtoResponse = UserCompany;
