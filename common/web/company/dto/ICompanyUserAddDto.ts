import { RoleName } from '../../role/RoleName';

export interface ICompanyUserAddDto {
    name: string;
    lastname: string;
    middlename?: string;
    roles?: Array<RoleName>;
}
