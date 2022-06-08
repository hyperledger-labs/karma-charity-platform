import { ICompanyDetails, IBankAccountDetails } from '../ICompanyDetails';

export interface ICompanyUpdateDto {
    name: string;
    location: string;
    imageData?: string;
    description: string;
    shortDescription: string;

    details: ICompanyDetails;
    bankAccountDetails: IBankAccountDetails;
}
