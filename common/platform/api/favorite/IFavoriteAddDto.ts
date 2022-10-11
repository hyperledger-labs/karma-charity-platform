import { ITraceable } from '@ts-core/common';
import { Favorite, FavoriteObjectType } from '../../favorite';

export interface IFavoriteAddDto extends ITraceable {
    objectId: number;
    objectType: FavoriteObjectType;
}

