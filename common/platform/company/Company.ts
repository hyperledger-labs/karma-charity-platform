import { Type } from 'class-transformer';
import { CompanyStatus } from './CompanyStatus';
import { CompanyPreferences } from './CompanyPreferences';
import { PaymentAggregator } from '../payment/aggregator';
import { Accounts } from '../account';

export class Company {
    id: number;
    status: CompanyStatus;
    balance: Accounts;

    ledgerUid?: string;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    updatedDate: Date;

    @Type(() => CompanyPreferences)
    preferences: CompanyPreferences;

    @Type(() => PaymentAggregator)
    paymentAggregator: PaymentAggregator;
}

