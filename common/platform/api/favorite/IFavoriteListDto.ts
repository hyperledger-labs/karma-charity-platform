import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { Favorite } from '../../favorite';

export interface IFavoriteListDto extends IPaginable<Favorite>, ITraceable { }

export interface IFavoriteListDtoResponse extends IPagination<Favorite> { }
