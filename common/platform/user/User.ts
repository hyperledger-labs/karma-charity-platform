import { Type } from 'class-transformer';
import { UserType } from './UserType';
import { UserPreferences } from './UserPreferences';
import { UserStatus } from './UserStatus';

export class User {
    id: number;
    uid: string;
    type: UserType;
    login: string;
    status: UserStatus;
    resource: UserResource;

    password?: string;
    ledgerUid?: string;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    updatedDate: Date;

    @Type(() => UserPreferences)
    preferences: UserPreferences;
}

export enum UserResource {
    VK = 'VK',
    GOOGLE = 'GOOGLE',
    PASSWORD = 'PASSWORD',
}

