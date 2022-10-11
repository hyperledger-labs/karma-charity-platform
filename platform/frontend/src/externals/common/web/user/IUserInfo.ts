import { ICompanyExtended } from '../company/ICompany';
import { IUserExtended } from './IUser';

export interface IUserInfo {
    user: IUserExtended;
    company?: ICompanyExtended;
}
