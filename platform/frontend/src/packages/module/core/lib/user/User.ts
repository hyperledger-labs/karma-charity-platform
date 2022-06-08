import { IUser } from '@ts-core/angular';
import { User as UserBase } from '@common/platform/user';
import * as _ from 'lodash';
import { ObjectUtil } from '@ts-core/common/util';

export class User extends UserBase implements IUser<Partial<User>> {
    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public update(data: Partial<User>): void {
        ObjectUtil.copyPartial(data, this, null, ['preferences']);
        if (!_.isNil(data.preferences)) {
            ObjectUtil.copyPartial(data.preferences, this.preferences);
        }
    }

    public destroy(): void { }
}
