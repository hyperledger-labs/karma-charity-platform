import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common/transport';
import { UserService } from '@core/service';
import { UserProject } from '@project/common/platform/user';
import { ProjectUser } from '@project/common/platform/project';
import { ProjectUserRoleEditCommand } from '../transport';
import { PermissionUtil } from '@project/common/util';


@Injectable({ providedIn: 'root' })
export class ProjectUserMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static ROLE_EDIT = 10;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, private user: UserService) {
        super(language);

        let item: MenuListItem = null;

        item = new ListItem('user.action.roleEdit.roleEdit', ProjectUserMenu.ROLE_EDIT, null, 'fas fa-user-tag me-2');
        item.checkEnabled = (item, project, user) => this.isCanRole(project, user);
        item.action = (item, project, user) => transport.send(new ProjectUserRoleEditCommand({ projectId: project.id, userId: user.id }));
        this.add(item);

        this.complete();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private isCanRole(project: UserProject, user: ProjectUser): boolean {
        return PermissionUtil.isCanProjectUserEdit(project.roles);
    }

}

class MenuListItem extends ListItem<void> {
    action: (item: ListItem, project: UserProject, user: ProjectUser) => void;
    checkEnabled: (item: ListItem, project: UserProject, user: ProjectUser) => boolean;
}
