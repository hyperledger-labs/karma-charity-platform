import { WindowService } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LoginService, UserService } from '../../../core/service';
import { Transport } from '@ts-core/common/transport';
import { LoginOpenCommand } from '../../login/transport';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs';
import { UserEditCommand } from '../../user/transport';

@Injectable()
export class ProfileMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static PREFERENCES = 20;

    private static LOGIN = 1000;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        language: LanguageService,
        transport: Transport,
        windows: WindowService,
        user: UserService,
        login: LoginService,
    ) {
        super(language, true);

        let item: MenuListItem = null;

        item = new MenuListItem('login.login.login', ProfileMenu.LOGIN, null, 'fas fa fa-sign-in-alt me-2');
        item.checkEnabled = () => !login.isLoading && !user.isLogined;
        item.action = async () => transport.sendListen(new LoginOpenCommand());
        this.add(item);

        item = new MenuListItem('login.logout.logout', ProfileMenu.LOGIN, null, 'fas fa fa-sign-out-alt me-2');
        item.checkEnabled = () => !login.isLoading && user.isLogined;
        item.action = async () => {
            await windows.question('login.logout.confirmation').yesNotPromise;
            login.logout();
        };
        this.add(item);

        item = new MenuListItem('user.preferences.preferences', ProfileMenu.PREFERENCES, null, 'fas fa fa-cog me-2');
        item.checkEnabled = () => user.isLogined;
        item.action = async () => transport.send(new UserEditCommand(user.user.id));
        this.add(item);

        merge(user.logined, user.logouted)
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.refresh());

        this.complete();
        this.refresh();
    }
}

class MenuListItem extends ListItem<void> {
    action: (item: ListItem) => void;
    checkEnabled: (item: ListItem) => boolean;
}
