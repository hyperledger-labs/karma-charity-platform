import { Component, ViewContainerRef } from '@angular/core';
import { SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { PipeService } from '@core/service';
import * as _ from 'lodash';
import { ISerializable } from '@ts-core/common';
import { } from '@common/platform/company';
import { Transport } from '@ts-core/common/transport';
import {
    CompanyPreferences
} from '@project/common/platform/company';
import { Client } from '@project/common/platform/api';
import { CompanyBaseComponent } from '../CompanyBaseComponent';
import { ICompanyUserRoleEditDtoResponse } from '../../transport';
import { UserCompany } from '@project/common/platform/user';
import { CompanyUser } from '@project/common/platform/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { ICompanyUserRoleSetDto } from '@project/common/platform/api/company';

@Component({
    selector: 'company-user-role-edit',
    templateUrl: 'company-user-role-edit.component.html'
})
export class CompanyUserRoleEditComponent extends CompanyBaseComponent implements ISerializable<ICompanyUserRoleSetDto> {
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

    private _user: CompanyUser;

    public roles: Array<LedgerCompanyRole>;
    public rolesAll: SelectListItems<SelectListItem<LedgerCompanyRole>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private pipe: PipeService,
        private windows: WindowService,
    ) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');

        this.rolesAll = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(LedgerCompanyRole).forEach((item, index) => this.rolesAll.add(new SelectListItem(`role.name.${item}`, index, item)));
        this.rolesAll.complete();
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

    public async submit(): Promise<void> {
        await this.windows.question('user.action.roleEdit.confirmation').yesNotPromise;
        this.emit(CompanyUserRoleEditComponent.EVENT_SUBMITTED);
    }

    public serialize(): ICompanyUserRoleSetDto {
        return this.roles;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.user = null;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public get user(): CompanyUser {
        return this._user;
    }
    public set user(value: CompanyUser) {
        if (value === this._user) {
            return;
        }
        this._user = value;
        if (!_.isNil(value)) {
            this.commitUserProperties();
        }
    }

}
