import { Project } from '@common/platform/project';
import { CdkTablePaginableMapCollection, ICdkTableColumn, ICdkTableSettings } from '@ts-core/angular';
import { IPagination } from '@ts-core/common';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { PipeService, UserService } from '@core/service';
import { Injectable } from '@angular/core';
import { TransformUtil } from '@ts-core/common';
import { UserProject } from '@project/common/platform/user';
import { ProjectStatus } from '@project/common/platform/project';

@Injectable()
export class ProjectMapCollection extends CdkTablePaginableMapCollection<Project, UserProject> {
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

    protected request(): Promise<IPagination<UserProject>> {
        return this.api.projectList(this.createRequestData());
    }

    protected parseItem(item: UserProject): UserProject {
        return TransformUtil.toClass(UserProject, item);
    }
}

export class ProjectTableSettings implements ICdkTableSettings<UserProject> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public columns: Array<ICdkTableColumn<UserProject>>;
    public static COLUMN_NAME_MENU = 'menu';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(pipe: PipeService, user: UserService) {
        this.columns = [];
        this.columns.push({
            name: ProjectTableSettings.COLUMN_NAME_MENU,
            headerId: '',
            headerClassName: 'ps-3',
            className: 'ps-3 fas fa-ellipsis-v',
            isDisableSort: true,
        });
        this.columns.push({
            name: 'picture',
            headerId: '',
            isImage: true,
            cellStyleName: () => {
                return { width: '21px' };
            },
            cellClassName: 'border rounded my-2',
            format: item => item.preferences.picture
        })
        this.columns.push({
            name: 'title',
            headerId: 'project.preferences.title',
            isDisableSort: true,
            format: item => item.preferences.title
        })
        this.columns.push({
            name: 'required',
            headerId: 'project.account.required',
            isDisableSort: true,
            format: item => pipe.account.transform(item.balance.required)
        })
        this.columns.push({
            name: 'collected',
            headerId: 'project.account.collected',
            isDisableSort: true,
            format: item => pipe.account.transform(item.balance.collected)
        })
        this.columns.push({
            name: 'status',
            headerId: 'project.status.status',
            className: item => {
                switch (item.status) {
                    case ProjectStatus.VERIFICATION_PROCESS:
                        return 'text-warning';
                    case ProjectStatus.REJECTED:
                    case ProjectStatus.NON_ACTIVE:
                        return 'text-danger';
                }
                return null;
            },
            format: item => pipe.language.translate(`project.status.${item.status}`)
        })

        /*
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
        */
        this.columns.push({
            name: 'createdDate',
            headerId: 'user.createdDate',
            format: item => pipe.momentDate.transform(item.createdDate)
        });
    }
}
