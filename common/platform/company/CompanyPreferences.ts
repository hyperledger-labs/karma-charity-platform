import { Type } from 'class-transformer';
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

    city: string;
    description: string;

    phone?: string;
    email?: string;
    picture?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
    addressPost?: string;
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
export const COMPANY_PREFERENCES_CITY_MAX_LENGTH = COMPANY_PREFERENCES_STRING_MAX_LENGTH;
