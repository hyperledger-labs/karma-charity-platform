import { ITraceable } from '@ts-core/common';
import { FavoriteObjectType } from '../../favorite';

export interface IFavoriteRemoveDto extends ITraceable {
    objectId: number;
    objectType: FavoriteObjectType;
}

