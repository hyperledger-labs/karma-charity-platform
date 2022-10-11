import { Type } from 'class-transformer';
import { IGeo } from '../geo';
import * as _ from 'lodash';

export class CompanyPreferences {
    title: string;

    ceo: string;
    inn: string;
    kpp: string;
    ogrn: string;
    name: string;
    address: string;
    nameShort: string;
    
    @Type(() => Date)
    founded: Date;

    description: string;

    phone?: string;
    email?: string;
    picture?: string;
    website?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    addressPost?: string;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toGeo(): IGeo {
        if (_.isNil(this.location) || _.isNil(this.latitude) || _.isNil(this.longitude)) {
            return null;
        }
        return { location: this.location, latitude: this.latitude, longitude: this.longitude };
    }
}


export const COMPANY_PREFERENCES_STRING_MAX_LENGTH = 256;

export const COMPANY_PREFERENCES_INN_MIN_LENGTH = 10;
export const COMPANY_PREFERENCES_INN_MAX_LENGTH = 12;
export const COMPANY_PREFERENCES_TITLE_MIN_LENGTH = 5;
export const COMPANY_PREFERENCES_TITLE_MAX_LENGTH = 50;

export const COMPANY_PREFERENCES_PHONE_MAX_LENGTH = 12;
export const COMPANY_PREFERENCES_EMAIL_MAX_LENGTH = 50;
export const COMPANY_PREFERENCES_WEBSITE_MAX_LENGTH = 50;
export const COMPANY_PREFERENCES_ADDRESS_MAX_LENGTH = 100;
export const COMPANY_PREFERENCES_DESCRIPTION_MIN_LENGTH = 5;
export const COMPANY_PREFERENCES_DESCRIPTION_MAX_LENGTH = 20480;
export const COMPANY_PREFERENCES_PICTURE_MAX_LENGTH = COMPANY_PREFERENCES_STRING_MAX_LENGTH;
export const COMPANY_PREFERENCES_LOCATION_MAX_LENGTH = COMPANY_PREFERENCES_STRING_MAX_LENGTH;
