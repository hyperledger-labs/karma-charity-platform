import { IPaginable, IPagination } from '@ts-core/common/dto';
import { ITraceable } from '@ts-core/common/trace';
import { User } from '../../user';

export interface IUserListDto extends IPaginable<User>, ITraceable {}

export interface IUserListDtoResponse extends IPagination<User> {}
