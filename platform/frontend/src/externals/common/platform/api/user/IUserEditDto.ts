import { ITraceable } from '@ts-core/common';
import { User, UserStatus, UserType, UserPreferences } from '../../user';

export interface IUserEditDto extends ITraceable {
    id?: number;
    type?: UserType;
    status?: UserStatus;
    preferences?: Partial<UserPreferences>;
}
export declare type IUserEditDtoResponse = User;
