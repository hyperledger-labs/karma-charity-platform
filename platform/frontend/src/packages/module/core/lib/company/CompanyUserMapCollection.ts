import { CdkTablePaginableMapCollection, ICdkTableColumn, ICdkTableSettings } from '@ts-core/angular';
import { IPagination } from '@ts-core/common/dto';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { PipeService, UserService } from '@core/service';
import { Injectable } from '@angular/core';
import { TransformUtil } from '@ts-core/common/util';
import { UserPreferences } from '@project/common/platform/user';
import { CompanyUser } from '@project/common/platform/company';

@Injectable()
export class CompanyUserMapCollection extends CdkTablePaginableMapCollection<CompanyUser, CompanyUser> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _companyId: number;

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

    private commitCompanyIdProperties(): void {
        this.reload();
    }

    public async reload(): Promise<void> {
        if (_.isNil(this.companyId)) {
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

    protected request(): Promise<IPagination<CompanyUser>> {
        return this.api.companyUserList(this.createRequestData(), this.companyId);
    }

    protected parseItem(item: CompanyUser): CompanyUser {
        return TransformUtil.toClass(CompanyUser, item);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get companyId(): number {
        return this._companyId;
    }
    public set companyId(value: number) {
        if (value === this._companyId) {
            return;
        }
        this._companyId = value;
        if (!_.isNil(value)) {
            this.commitCompanyIdProperties();
        }
    }
}

export class CompanyUserTableSettings implements ICdkTableSettings<CompanyUser> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public columns: Array<ICdkTableColumn<CompanyUser>>;
    public static COLUMN_NAME_MENU = 'menu';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(pipe: PipeService, user: UserService) {
        let hasPreferences = (item: CompanyUser, name: keyof UserPreferences) => !_.isNil(item.preferences) && !_.isEmpty(item.preferences['name']);

        this.columns = [];
        this.columns.push({
            name: CompanyUserTableSettings.COLUMN_NAME_MENU,
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
