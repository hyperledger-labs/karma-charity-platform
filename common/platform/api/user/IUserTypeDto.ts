import { ITraceable } from '@ts-core/common/trace';
import { User, UserType } from '../../user';

export interface IUserTypeDto extends ITraceable {
    type: UserType;
}
export declare type IUserTypeDtoResponse = User;
