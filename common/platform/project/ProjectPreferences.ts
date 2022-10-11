import { IGeo } from '../geo';
import * as _ from 'lodash';
import { ProjectTag } from './ProjectTag';

export class ProjectPreferences {
    title: string;
    city: string;
    description: string;
    descriptionShort: string;

    tags?: Array<ProjectTag>;
    picture?: string;
    isUrgent?: boolean;

    latitude?: number;
    longitude?: number;
}


export const PROJECT_PREFERENCES_STRING_MAX_LENGTH = 256;

export const PROJECT_PREFERENCES_TITLE_MIN_LENGTH = 5;
export const PROJECT_PREFERENCES_TITLE_MAX_LENGTH = 50;

export const PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH = 5;
export const PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH = 20480;

export const PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH = 5;
export const PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH = 512;

export const PROJECT_PREFERENCES_TAGS_MAX_LENGTH = 10;

export const PROJECT_PREFERENCES_CITY_MAX_LENGTH = PROJECT_PREFERENCES_STRING_MAX_LENGTH;
export const PROJECT_PREFERENCES_PICTURE_MAX_LENGTH = PROJECT_PREFERENCES_STRING_MAX_LENGTH;
