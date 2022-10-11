import { ICompanyDetails, IBankAccountDetails } from './ICompanyDetails';

export interface ICompanyPublic {
    id: number;
    name: string;
    logo?: string;
    location: string;
    shortDescription: string;
    collectedAmount: number;

    totalProjects: number;
}

export interface ICompanyPublicExtended extends ICompanyPublic {
    description: string;
    ledgerUid?: string;
    totalDonations: number;
    totalMonthlyDonaters: number;
    details: ICompanyDetails;
    bankAccountDetails: IBankAccountDetails;
}
