import { UserRoleEntity } from '@project/module/database/user';
import { CompanyEntity } from '../company/CompanyEntity';
import { UserEntity } from './UserEntity';

export interface IUserHolder {
    user: UserEntity;
    roles?: Array<UserRoleEntity>;
    company?: CompanyEntity;
}
