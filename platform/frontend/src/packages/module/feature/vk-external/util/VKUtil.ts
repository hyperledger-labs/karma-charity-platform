
import { VkLoginUser } from '@project/common/platform/api/login';
import * as _ from 'lodash';

export class VKUtil {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static createUser(data: any, params: string): VkLoginUser {
        let item = new VkLoginUser();
        item.id = data.id;
        item.params = params;
        item.preferences = {
            name: `${data.first_name} ${data.last_name}`,
            picture: data.photo_200
        }

        // Geo
        let location = '';
        if (!_.isNil(data.country)) {
            location += ` ${data.country.title}`;
        }
        if (!_.isNil(data.city)) {
            location += `, ${data.city.title}`;
        }
        location = location.trim();
        if (!_.isEmpty(location)) {
            item.preferences.location = location;
        }

        // Male
        if (!_.isNil(data.sex) && data.sex !== 0) {
            item.preferences.isMale = data.sex === 2;
        }

        // birthday
        if (!_.isNil(data.bdate)) {
            let array = String(data.bdate).split('.');
            if (array.length === 3) {
                item.preferences.birthday = new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0]));
            }
            else if (array.length === 2) {
                item.preferences.birthday = new Date(1900, Number(array[1]) - 1, Number(array[0]));
            }
        }

        // About
        if (!_.isNil(data.about)) {
            item.preferences.description = data.about;
        }
        if (!_.isNil(data.status) && _.isEmpty(item.preferences.description)) {
            item.preferences.description = data.status;
        }
        if (_.isEmpty(item.preferences.description)) {
            delete item.preferences.description;
        }

        return item;
    }

}