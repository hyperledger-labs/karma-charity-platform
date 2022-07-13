
import { User, USER_PREFERENCES_DESCRIPTION_MAX_LENGTH, USER_PREFERENCES_NAME_MAX_LENGTH, USER_PREFERENCES_NAME_MIN_LENGTH, USER_PREFERENCES_STRING_MAX_LENGTH } from "@project/common/platform/user";
import { IWindowContent } from "@ts-core/angular";
import * as _ from 'lodash';

export abstract class UserBaseComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _user: User;

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    protected commitUserProperties(): void { }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.user = null;
    }
    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get user(): User {
        return this._user;
    }
    public set user(value: User) {
        if (value === this._user) {
            return;
        }
        this._user = value;
        if (!_.isNil(value)) {
            this.commitUserProperties();
        }
    }

    public get stringMaxLength(): number {
        return USER_PREFERENCES_STRING_MAX_LENGTH;
    }
    public get nameMinLength(): number {
        return USER_PREFERENCES_NAME_MIN_LENGTH;
    }
    public get nameMaxLength(): number {
        return USER_PREFERENCES_NAME_MAX_LENGTH;
    }
    public get descriptionMaxLength(): number {
        return USER_PREFERENCES_DESCRIPTION_MAX_LENGTH;
    }
}