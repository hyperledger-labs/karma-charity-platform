import { ITraceable } from '@ts-core/common';
import { User, UserCompany } from '../../user';

export interface IInitDto extends ITraceable { }

export interface IInitDtoResponse {
    user: User;
    company?: UserCompany;
}
