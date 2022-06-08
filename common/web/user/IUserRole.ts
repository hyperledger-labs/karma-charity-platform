import { RoleName } from '../role/RoleName';

export interface IUserRole {
    id: number;
    role: RoleName;
    createdAt: Date;
    updatedAt: Date;
    companyId?: number;
    projectId?: number;
}
