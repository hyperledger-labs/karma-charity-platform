import { IPagination } from '@ts-core/common/dto';
import { IUser } from '.';

export interface IUserList extends IPagination<IUser> {}
