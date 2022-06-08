import { ICompanyDetails, IBankAccountDetails } from '../ICompanyDetails';

export interface ICompanyCreateDto {
    name: string;
    location: string;
    imageData?: string;
    description: string;
    shortDescription: string;

    details: ICompanyDetails;
    bankAccountDetails: IBankAccountDetails;
}
