import { IPaginable } from '@ts-core/common';
import { IUser } from './IUser';

export interface IUserListDto extends IPaginable<IUser> {}
