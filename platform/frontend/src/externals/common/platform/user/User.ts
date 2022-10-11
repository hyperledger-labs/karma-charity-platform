import { Type } from 'class-transformer';
import { UserType } from './UserType';
import { LoginResource } from '../api/login';
import { UserPreferences } from './UserPreferences';
import { UserRole } from './UserRole';
import { UserStatus } from './UserStatus';

export class User {
    id: number;
    uid: string;
    type: UserType;
    login: string;
    status: UserStatus;
    resource: LoginResource;

    ledgerUid?: string;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    updatedDate: Date;

    @Type(() => UserPreferences)
    preferences: UserPreferences;
}

