import { Component, Input, ViewContainerRef } from '@angular/core';
import { IWindowContent, SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import { UserService, PipeService } from '../../../../core/service';
import * as _ from 'lodash';
import { User, UserPreferences, UserPreferencesProjectCancelStrategy } from '@common/platform/user';
import { ISerializable } from '@ts-core/common';
import { IUserEditDto } from '@common/platform/api/user';
import { UserType, UserStatus, USER_PREFERENCES_NAME_MIN_LENGTH, USER_PREFERENCES_DESCRIPTION_MAX_LENGTH, USER_PREFERENCES_NAME_MAX_LENGTH } from '@common/platform/user';
import moment, { Moment } from 'moment';
import { LoginResource } from '@common/platform/api/login';
import { Transport } from '@ts-core/common/transport';
import { UserBaseComponent } from '../UserBaseComponent';

@Component({
    selector: 'user-edit',
    templateUrl: 'user-edit.component.html'
})
export class UserEditComponent extends UserBaseComponent implements ISerializable<IUserEditDto> {
    //--------------------------------------------------------------------------
    //
    //  Constants
    //
    //--------------------------------------------------------------------------

    public static EVENT_SUBMITTED = 'EVENT_SUBMITTED';

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public types: SelectListItems<SelectListItem<UserType>>;
    public locales: SelectListItems<SelectListItem<string>>;
    public isMales: SelectListItems<SelectListItem<boolean>>;
    public statuses: SelectListItems<SelectListItem<UserStatus>>;
    public projectCancelStrategies: SelectListItems<SelectListItem<UserPreferencesProjectCancelStrategy>>;

    public type: UserType;
    public status: UserStatus;

    public name: string;
    public phone: string;
    public email: string;
    public locale: string;
    public isMale: boolean;
    public picture: string;
    public location: string;
    public latitude: number;
    public longitude: number;
    public ledgerUid: string;
    public resource: LoginResource;
    public birthday: Moment;
    public description: string;
    public projectCancelStrategy: UserPreferencesProjectCancelStrategy;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private pipe: PipeService,
        private service: UserService,
        private windows: WindowService,
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex flex-column');

        this.types = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(UserType).forEach((item, index) => this.types.add(new SelectListItem(`user.type.${item}`, index, item)));
        this.types.complete();
        
        this.statuses = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(UserStatus).forEach((item, index) => this.statuses.add(new SelectListItem(`user.status.${item}`, index, item)));
        this.statuses.complete();

        this.locales = this.addDestroyable(new SelectListItems(this.pipe.language));
        ['ru'].forEach((item, index) => this.locales.add(new SelectListItem(`user.preferences.locale.${item}`, index, item)));
        this.locales.complete();

        this.isMales = this.addDestroyable(new SelectListItems(this.pipe.language));
        [true, false].forEach((item, index) => this.isMales.add(new SelectListItem(`user.preferences.isMale.${item}`, index, item)));
        this.isMales.complete();

        this.projectCancelStrategies = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(UserPreferencesProjectCancelStrategy).forEach((item, index) => this.projectCancelStrategies.add(new SelectListItem(`user.preferences.projectCancelStrategy.${item}`, index, item)));
        this.projectCancelStrategies.complete();
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitUserProperties(): void {
        super.commitUserProperties();
        
        let value = null;

        value = this.user.type;
        if (value !== this.type) {
            this.type = value;
        }

        value = this.user.status;
        if (value !== this.status) {
            this.status = value;
        }

        value = this.user.preferences.name;
        if (value !== this.name) {
            this.name = value;
        }

        value = this.user.resource;
        if (value !== this.name) {
            this.resource = value;
        }

        value = this.user.preferences.phone;
        if (value !== this.phone) {
            this.phone = value;
        }

        value = this.user.preferences.email;
        if (value !== this.email) {
            this.email = value;
        }

        value = this.user.preferences.locale;
        if (value !== this.locale) {
            this.locale = value;
        }

        value = this.user.preferences.isMale;
        if (value !== this.isMale) {
            this.isMale = value;
        }

        value = this.user.preferences.birthday;
        if (value !== this.birthday) {
            this.birthday = moment(value);
        }

        value = this.user.preferences.picture;
        if (value !== this.picture) {
            this.picture = value;
        }

        value = this.user.preferences.description;
        if (value !== this.description) {
            this.description = value;
        }

        value = this.user.preferences.location;
        if (value !== this.location) {
            this.location = value;
        }

        value = this.user.preferences.latitude;
        if (value !== this.latitude) {
            this.latitude = value;
        }

        value = this.user.preferences.longitude;
        if (value !== this.longitude) {
            this.longitude = value;
        }

        value = this.user.preferences.projectCancelStrategy;
        if (value !== this.projectCancelStrategy) {
            this.projectCancelStrategy = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async submit(): Promise<void> {
        await this.windows.question('user.action.save.confirmation').yesNotPromise;
        this.emit(UserEditComponent.EVENT_SUBMITTED);
    }

    public async geoSelect(): Promise<void> {
        /*
        let item = await this.transport.sendListen(new GeoSelectCommand(this.user.preferences.toGeo()), { timeout: DateUtil.MILISECONDS_DAY });
        this.location = item.location;
        this.latitude = item.latitude;
        this.longitude = item.longitude;
        */
    }

    public serialize(): IUserEditDto {
        let preferences = {} as Partial<UserPreferences>;
        preferences.name = this.name;
        preferences.phone = this.phone;
        preferences.email = this.email;
        preferences.locale = this.locale;
        preferences.isMale = this.isMale;
        preferences.location = this.location;
        preferences.latitude = this.latitude;
        preferences.longitude = this.longitude;
        preferences.description = this.description;
        preferences.projectCancelStrategy = this.projectCancelStrategy;
        if (!_.isNil(this.birthday)) {
            preferences.birthday = this.birthday.toDate();
        }
        let item: IUserEditDto = { id: this.user.id, preferences };
        if (this.isAdministrator) {
            item.type = this.type;
            item.status = this.status;
        }
        return item;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get isAdministrator(): boolean {
        return this.service.isAdministrator;
    }

    public get user(): User {
        return super.user;
    }
    @Input()
    public set user(value: User) {
        super.user = value;
    }
}
