import { WindowService, ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common/transport';
import { UserEditCommand } from '../transport';
import { UserService } from '../../../core/service';

@Injectable({ providedIn: 'root' })
export class UserMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static EDIT = 10;

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, service: UserService) {
        super(language);

        let item: IListItem<void> = null;

        item = new ListItem('user.action.edit.edit', UserMenu.EDIT, null, 'fas fa-edit me-2');
        item.checkEnabled = (item, user) => service.isAdministrator || service.isUser(user);
        item.action = (item, user) => transport.send(new UserEditCommand(user.id));
        this.add(item)

        this.complete();
    }
}
