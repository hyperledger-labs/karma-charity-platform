import { Component, ViewContainerRef } from '@angular/core';
import { SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { PipeService } from '@core/service';
import * as _ from 'lodash';
import { ISerializable } from '@ts-core/common';
import { } from '@common/platform/project';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { ProjectUser } from '@project/common/platform/project';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { IProjectUserRoleSetDto } from '@project/common/platform/api/project';

@Component({
    selector: 'project-user-role-edit',
    templateUrl: 'project-user-role-edit.component.html'
})
export class ProjectUserRoleEditComponent extends ProjectBaseComponent implements ISerializable<IProjectUserRoleSetDto> {
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

    private _user: ProjectUser;

    public roles: Array<LedgerProjectRole>;
    public rolesAll: SelectListItems<SelectListItem<LedgerProjectRole>>;

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
        Object.values(LedgerProjectRole).forEach((item, index) => this.rolesAll.add(new SelectListItem(`role.name.${item}`, index, item)));
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
        this.emit(ProjectUserRoleEditComponent.EVENT_SUBMITTED);
    }

    public serialize(): IProjectUserRoleSetDto {
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

    public get user(): ProjectUser {
        return this._user;
    }
    public set user(value: ProjectUser) {
        if (value === this._user) {
            return;
        }
        this._user = value;
        if (!_.isNil(value)) {
            this.commitUserProperties();
        }
    }

}
