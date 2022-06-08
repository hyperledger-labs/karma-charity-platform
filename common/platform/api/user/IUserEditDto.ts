import { ITraceable } from '@ts-core/common/trace';
import { User, UserType, UserPreferences } from '../../user';

export interface IUserEditDto extends ITraceable {
    uid?: string;
    type?: UserType;
    status?: UserType;
    preferences?: Partial<UserPreferences>;
}
export declare type IUserEditDtoResponse = User;
