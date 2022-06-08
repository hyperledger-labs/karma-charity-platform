import { Component, ViewContainerRef } from '@angular/core';
import { IWindowContent, ViewUtil, WindowService } from '@ts-core/angular';
import { PipeService } from '../../../../core/service';
import * as _ from 'lodash';
import { DestroyableContainer, ISerializable } from '@ts-core/common';
import { } from '@common/platform/company';
import { Client } from 'common/platform/api';
import { User } from 'common/platform/user';

@Component({
    selector: 'company-user-add',
    templateUrl: 'company-user-add.component.html'
})
export class CompanyUserAddComponent extends IWindowContent implements ISerializable<number>{
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

    public uid: string;
    public companyId: number;

    private _user: User;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private api: Client,
        private pipe: PipeService,
        private windows: WindowService,
    ) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');
    }

    //--------------------------------------------------------------------------
    //
    //  Private Methods
    //
    //--------------------------------------------------------------------------

    private commitUserProperties(): void { }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async load(): Promise<void> {
        if (this.isDisabled) {
            return;
        }

        this.isDisabled = true;
        try {
            this.user = await this.api.userFind(this.uid);
        }
        finally {
            this.isDisabled = false;
        }
    }

    public async submit(): Promise<void> {
        this.emit(CompanyUserAddComponent.EVENT_SUBMITTED);
    }

    public serialize(): number {
        return this.user.id;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.companyId = null;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
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

}
