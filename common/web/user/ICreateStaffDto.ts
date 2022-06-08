import { RoleName } from '../role/RoleName';

export interface ICreateStaffDto {
    lastname: string;
    name: string;
    middlename?: string;
    email: string;
    roles?: Array<RoleName>;
}
