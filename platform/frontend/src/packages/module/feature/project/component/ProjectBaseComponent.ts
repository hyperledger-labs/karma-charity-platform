import { PROJECT_PREFERENCES_TITLE_MIN_LENGTH, PROJECT_PREFERENCES_TITLE_MAX_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH, PROJECT_PREFERENCES_TAGS_MAX_LENGTH, PROJECT_PREFERENCES_PICTURE_MAX_LENGTH, PROJECT_PREFERENCES_LOCATION_MAX_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH, Project } from "@project/common/platform/project";
import { UserProject } from "common/platform/user";
import { IWindowContent } from "@ts-core/angular";
import * as _ from 'lodash';

export abstract class ProjectBaseComponent extends IWindowContent {

    //--------------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------------

    protected _project: UserProject;

    //--------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    //--------------------------------------------------------------------------

    protected commitProjectProperties():void {}

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.project = null;
    }
    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get project(): UserProject {
        return this._project;
    }
    public set project(value: UserProject) {
        if (value === this._project) {
            return;
        }
        this._project = value;
        if (!_.isNil(value)) {
            this.commitProjectProperties();
        }
    }

    public get titleMinLength(): number {
        return PROJECT_PREFERENCES_TITLE_MIN_LENGTH;
    }
    public get titleMaxLength(): number {
        return PROJECT_PREFERENCES_TITLE_MAX_LENGTH;
    }

    public get descriptionMinLength(): number {
        return PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH;
    }
    public get descriptionMaxLength(): number {
        return PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH;
    }

    public get descriptionShortMinLength(): number {
        return PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH;
    }
    public get descriptionShortMaxLength(): number {
        return PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH;
    }
}

/*
export const PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH = 5;
export const PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH = 2048;

export const PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH = 5;
export const PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH = 256;

export const PROJECT_PREFERENCES_TAGS_MAX_LENGTH = 10;

export const PROJECT_PREFERENCES_PICTURE_MAX_LENGTH = PROJECT_PREFERENCES_STRING_MAX_LENGTH;
export const PROJECT_PREFERENCES_LOCATION_MAX_LENGTH = PROJECT_PREFERENCES_STRING_MAX_LENGTH;
*/