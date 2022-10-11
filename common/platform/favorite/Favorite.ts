
import { UserCompany, UserProject } from '../user';
import { Type } from 'class-transformer';

export class Favorite {
    id: number;
    status: FavoriteStatus;

    object: UserProject | UserCompany;
    objectId: number;
    objectType: FavoriteObjectType;

    @Type(() => Date)
    createdDate: Date;
}

export enum FavoriteStatus {
    ACTIVE = 'ACTIVE',
    NON_ACTIVE = 'NON_ACTIVE'
}
export enum FavoriteObjectType {
    PROJECT = 'PROJECT',
    COMPANY = 'COMPANY',
}

