import { IPaginable } from '@ts-core/common/dto';
import { IUser } from './IUser';

export interface IUserListDto extends IPaginable<IUser> {}
