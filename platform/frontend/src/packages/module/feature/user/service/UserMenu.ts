import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common';
import { UserEditCommand, UserDeactivateCommand } from '../transport';
import { UserService } from '@core/service';
import { User } from '@project/common/platform/user';

@Injectable({ providedIn: 'root' })
export class UserMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static EDIT = 10;
    private static DEACTIVATE = 20;

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, private service: UserService) {
        super(language);

        let item: IListItem<void> = null;

        item = new ListItem('user.action.edit.edit', UserMenu.EDIT, null, 'fas fa-edit me-2');
        item.checkEnabled = (item, user) => this.isCanEdit(user);
        item.action = (item, user) => transport.send(new UserEditCommand(user.id));
        this.add(item);

        item = new ListItem('user.action.deactivate.deactivate', UserMenu.DEACTIVATE, null, 'fas fa-times me-2');
        item.checkEnabled = (item, user) => this.isCanDeactivate(user);
        item.action = (item, user) => transport.send(new UserDeactivateCommand(user.id));
        this.add(item);

        this.complete();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private isCanDeactivate(user: User): boolean {
        return this.service.isUser(user);
    }

    private isCanEdit(user: User): boolean {
        return this.service.isAdministrator || this.service.isUser(user);
    }
}
