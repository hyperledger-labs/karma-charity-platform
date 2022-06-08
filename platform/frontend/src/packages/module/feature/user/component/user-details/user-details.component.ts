import { Component, ElementRef, Input } from '@angular/core';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { User } from '@common/platform/user';
import { DestroyableContainer } from '@ts-core/common';

@Component({
    selector: 'user-details',
    templateUrl: 'user-details.component.html'
})
export class UserDetailsComponent extends DestroyableContainer {

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _user: User;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ElementRef
    ) {
        super();
        ViewUtil.addClasses(container, 'd-block');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitUserProperties(): void {
        let value = null;
    }

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
    @Input()
    public set user(value: User) {
        if (value === this._user) {
            return;
        }
        this._user = value;
        if (!_.isNil(value)) {
            this.commitUserProperties();
        }
    }
}
