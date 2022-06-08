import { User, UserPreferences } from '@common/platform/user';
import { CdkTablePaginableMapCollection, ICdkTableColumn, ICdkTableSettings } from '@ts-core/angular';
import { IPagination } from '@ts-core/common/dto';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { PipeService, UserService } from '../../service';
import { Injectable } from '@angular/core';
import { TransformUtil } from '@ts-core/common/util';

@Injectable()
export class UserMapCollection extends CdkTablePaginableMapCollection<User, User> {

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
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isNeedClearAfterLoad(): boolean {
        return true;
    }

    protected request(): Promise<IPagination<User>> {
        return this.api.userList(this.createRequestData());
    }

    protected parseItem(item: User): User {
        return TransformUtil.toClass(User, item);
    }
}

export class UserTableSettings implements ICdkTableSettings<User> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public columns: Array<ICdkTableColumn<User>>;
    public static COLUMN_NAME_MENU = 'menu';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(pipe: PipeService, user: UserService) {
        let hasPreferences = (item: User, name: keyof UserPreferences) => !_.isNil(item.preferences) && !_.isEmpty(item.preferences['name']);

        this.columns = [];
        this.columns.push({
            name: UserTableSettings.COLUMN_NAME_MENU,
            headerId: '',
            headerClassName: 'ps-3',
            className: 'ps-3 fas fa-ellipsis-v',
            isDisableSort: true,
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
        this.columns.push({
            name: 'createdDate',
            headerId: 'user.createdDate',
            format: item => pipe.momentDate.transform(item.createdDate)
        });
    }


}
