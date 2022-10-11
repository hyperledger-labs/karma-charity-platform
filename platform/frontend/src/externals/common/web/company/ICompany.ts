import { CompanyStatus } from './CompanyStatus';
import { ICompanyDetails, IBankAccountDetails } from './ICompanyDetails';

export interface ICompany {
    id: number;
    name: string;
    logo?: string;
    location: string;
    shortDescription: string;
    collectedAmount: number;

    status: CompanyStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICompanyExtended extends ICompany {
    details: ICompanyDetails;
    description: string;
    ledgerUid?: string;
    bankAccountDetails: IBankAccountDetails;
}
