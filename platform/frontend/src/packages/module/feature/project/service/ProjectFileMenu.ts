import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common/transport';
import { UserService } from '../../../core/service';
import { UserProject } from 'common/platform/user';
import { PermissionUtil } from 'common/util';
import { File } from '@project/common/platform/file';
import { FileOpenCommand, FileRemoveCommand } from '../../file/transport';


@Injectable({ providedIn: 'root' })
export class ProjectFileMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static OPEN = 10;
    private static REMOVE = 20;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, private user: UserService) {
        super(language);

        let item: MenuListItem = null;

        item = new ListItem('file.action.open.open', ProjectFileMenu.OPEN, null, 'fas fa-file me-2');
        item.action = (item, project, file) => transport.send(new FileOpenCommand(file));
        this.add(item);

        item = new ListItem('file.action.remove.remove', ProjectFileMenu.REMOVE, null, 'fas fa-minus-circle test-danger me-2');
        item.checkEnabled = (item, project, file) => this.isCanRemove(project, file);
        item.action = (item, project, file) => transport.send(new FileRemoveCommand(file.id));
        this.add(item);

        this.complete();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private isCanRemove(project: UserProject, file: File): boolean {
        return PermissionUtil.isCanProjectFileRemove(project.roles);
    }
}

class MenuListItem extends ListItem<void> {
    action: (item: ListItem, project: UserProject, file: File) => void;
    checkEnabled: (item: ListItem, project: UserProject, file: File) => boolean;
}
