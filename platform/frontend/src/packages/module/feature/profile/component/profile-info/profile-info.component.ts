import { Component, ViewContainerRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { takeUntil } from 'rxjs';
import { User } from '@core/lib/user';
import { ThemeAssetService } from '@ts-core/frontend/theme';
import { UserService, PipeService, LoginService } from '@core/service';
import { ProfileMenu } from '../../service';
import { merge } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'profile-info',
    templateUrl: 'profile-info.component.html',
    styleUrls: ['profile-info.component.scss']
})
export class ProfileInfoComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public name: string;
    public picture: string;
    public description: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        public menu: ProfileMenu,
        private pipe: PipeService,
        private user: UserService,
        private themeAsset: ThemeAssetService
    ) {
        super();
        ViewUtil.addClasses(container.element, 'd-block mouse-active');

        this.commitUserProperties();
        merge(user.logined, user.changed, pipe.language.completed)
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.commitUserProperties());
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitUserProperties(): void {
        let value = null;

        value = this.pipe.userTitle.transform(this.profile);
        if (value !== this.name) {
            this.name = value;
        }

        value = this.pipe.language.translate(`user.type.${this.profile.type}`);
        if (value !== this.description) {
            this.description = value;
        }

        value = this.getPicture();
        if (value !== this.picture) {
            this.picture = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public getPicture(): string {
        if (_.isNil(this.profile.preferences.picture)) {
            return this.themeAsset.getIcon('moon64');
        }
        return this.profile.preferences.picture;
    }

    public get profile(): User {
        return this.user.user;
    }
}
