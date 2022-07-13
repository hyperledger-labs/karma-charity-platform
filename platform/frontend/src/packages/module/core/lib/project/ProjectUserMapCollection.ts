import { CdkTablePaginableMapCollection, ICdkTableColumn, ICdkTableSettings } from '@ts-core/angular';
import { IPagination } from '@ts-core/common/dto';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { PipeService, UserService } from '@core/service';
import { Injectable } from '@angular/core';
import { TransformUtil } from '@ts-core/common/util';
import { UserPreferences } from '@project/common/platform/user';
import { ProjectUser } from '@project/common/platform/project';

@Injectable()
export class ProjectUserMapCollection extends CdkTablePaginableMapCollection<ProjectUser, ProjectUser> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _projectId: number;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: Client) {
        super(`id`);
        this.sort.createdDate = false;
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    private commitProjectIdProperties(): void {
        this.reload();
    }

    public async reload(): Promise<void> {
        if (_.isNil(this.projectId)) {
            return;
        }
        return super.reload();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isNeedClearAfterLoad(): boolean {
        return true;
    }

    protected request(): Promise<IPagination<ProjectUser>> {
        return this.api.projectUserList(this.createRequestData(), this.projectId);
    }

    protected parseItem(item: ProjectUser): ProjectUser {
        return TransformUtil.toClass(ProjectUser, item);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get projectId(): number {
        return this._projectId;
    }
    public set projectId(value: number) {
        if (value === this._projectId) {
            return;
        }
        this._projectId = value;
        if (!_.isNil(value)) {
            this.commitProjectIdProperties();
        }
    }
}

export class ProjectUserTableSettings implements ICdkTableSettings<ProjectUser> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public columns: Array<ICdkTableColumn<ProjectUser>>;
    public static COLUMN_NAME_MENU = 'menu';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(pipe: PipeService, user: UserService) {
        let hasPreferences = (item: ProjectUser, name: keyof UserPreferences) => !_.isNil(item.preferences) && !_.isEmpty(item.preferences['name']);

        this.columns = [];
        this.columns.push({
            name: ProjectUserTableSettings.COLUMN_NAME_MENU,
            headerId: '',
            className: 'fas fa-ellipsis-v',
            isDisableSort: true
        });
        this.columns.push({
            name: 'email',
            headerId: 'user.preferences.email',
            isDisableSort: true,
            format: item => hasPreferences(item, 'email') ? item.preferences.email : item.login,
        })

        this.columns.push({
            name: 'name',
            headerId: 'user.preferences.name',
            isDisableSort: true,
            format: item => pipe.userTitle.transform(item)
        })
        this.columns.push({
            name: 'role',
            headerId: 'role.roles',
            isDisableSort: true,
            isMultiline: true,
            format: item => pipe.role.transform(item.roles)
        })
        if (user.isAdministrator) {
            this.columns.push({
                name: 'type',
                headerId: 'user.type.type',
                format: item => pipe.language.translate(`user.type.${item.type}`)
            })
            this.columns.push({
                name: 'login',
                headerId: 'user.login',
                format: item => item.login,
            })
        }
    }


}
