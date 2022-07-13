import { Type } from 'class-transformer';
import { IGeo } from '../geo';
import * as _ from 'lodash';

export class UserPreferences {
    name?: string;
    phone?: string;
    email?: string;
    isMale?: boolean;
    locale?: string;
    picture?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    description?: string;

    projectCancelStrategy?: UserPreferencesProjectCancelStrategy;

    @Type(() => Date)
    birthday?: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toGeo(): IGeo {
        if (_.isNil(this.location) || _.isNil(this.latitude) || _.isNil(this.longitude)) {
            return null;
        }
        return {
            location: this.location, latitude: this.latitude, longitude: this.longitude
        };
    }
}

export enum UserPreferencesProjectCancelStrategy {
    REFUND_TO_COMPANY = 'REFUND_TO_COMPANY',
    REFUND_TO_PROJECTS = 'REFUND_TO_PROJECTS'
}

export const USER_PREFERENCES_STRING_MAX_LENGTH = 256;

export const USER_PREFERENCES_NAME_MIN_LENGTH = 5;
export const USER_PREFERENCES_NAME_MAX_LENGTH = 50;

export const USER_PREFERENCES_PHONE_MAX_LENGTH = 12;
export const USER_PREFERENCES_EMAIL_MAX_LENGTH = 50;
export const USER_PREFERENCES_LOCALE_MAX_LENGTH = 2;
export const USER_PREFERENCES_PICTURE_MAX_LENGTH = USER_PREFERENCES_STRING_MAX_LENGTH;
export const USER_PREFERENCES_LOCATION_MAX_LENGTH = USER_PREFERENCES_STRING_MAX_LENGTH;
export const USER_PREFERENCES_DESCRIPTION_MAX_LENGTH = USER_PREFERENCES_STRING_MAX_LENGTH;
