import { UserStatus } from './UserStatus';
import { UserType } from './UserType';
import { IUserRole } from './IUserRole';

export interface IUser {
    id: number;
    lastname: string;
    name: string;
    middlename?: string;
    email: string;
    status: UserStatus;
    type: UserType;
    createdAt: Date;
    updatedAt: Date;
    fullName: string;
}

export interface IUserExtended extends IUser {
    ledgerUid?: string;
    roles?: IUserRole[];
}
