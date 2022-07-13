import { ITraceable } from '@ts-core/common/trace';
import { User, UserCompany } from '../../user';

export interface IInitDto extends ITraceable { }

export interface IInitDtoResponse {
    user: User;
    company?: UserCompany;
}
