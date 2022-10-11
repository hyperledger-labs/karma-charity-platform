import { Component, ViewContainerRef } from '@angular/core';
import { IWindowContent, SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { takeUntil } from 'rxjs';
import { UserService, PipeService } from '@core/service';
import { merge } from 'rxjs';
import * as _ from 'lodash';
import { UserType } from '@project/common/platform/user';
import { Client } from '@project/common/platform/api';
import { ISerializable } from '@ts-core/common';

@Component({
    selector: 'profile-quiz',
    templateUrl: 'profile-quiz.component.html'
})
export class ProfileQuizComponent extends IWindowContent implements ISerializable<UserType>{

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

    public type: UserType;
    public tabs: SelectListItems<SelectListItem<UserType>>;
    public types: SelectListItems<SelectListItem<UserType>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private windows: WindowService,
        private pipe: PipeService,
        public user: UserService,
    ) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');

        this.tabs = this.addDestroyable(new SelectListItems(this.pipe.language));
        [UserType.UNDEFINED, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER].forEach((item, index) => this.tabs.add(new SelectListItem(`profile.quiz.step.${item}.description`, index, item)));
        this.tabs.complete();

        this.types = this.addDestroyable(new SelectListItems(this.pipe.language));
        [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER].forEach((item, index) => this.types.add(new SelectListItem(`user.type.${item}`, index, item)));
        this.types.complete();

        this.commitUserProperties();
        merge(user.changed)
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.commitUserProperties());
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async finish(): Promise<void> {
        await this.windows.question('profile.quiz.confirmation', { type: this.pipe.language.translate(`user.type.${this.type}`) }).yesNotPromise;
        this.emit(ProfileQuizComponent.EVENT_SUBMITTED);
    }

    public serialize(): UserType {
        return this.type;
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitUserProperties(): void {
        let value = null;
        this.type = this.tabs.selectedData = this.user.user.type;
    }

}

