import { ISelectListItem, SelectListItem, SelectListItems } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { UserService, CompanyService, RouterService } from '@core/service';
import { takeUntil } from 'rxjs';
import { merge } from 'rxjs';

@Injectable()
export class ShellMenu extends SelectListItems<ISelectListItem<string>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static ABOUT = 0;
    private static PUBLICATIONS = 10;
    private static FUNDS = 20;
    private static BECOME_PARTNER = 30;
    private static SHOP = 40;
    private static CONTACTS = 50;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService,
        user: UserService,
        company: CompanyService,
        router: RouterService) {

        super(language);

        let item: ISelectListItem = null;

        this.add(new ShellListItem('main.menu.about', ShellMenu.ABOUT, `/${RouterService.COMPANIES_URL}`));
        this.add(new ShellListItem('main.menu.publications', ShellMenu.PUBLICATIONS, `/${RouterService.COMPANIES_URL}`));
        this.add(new ShellListItem('main.menu.funds', ShellMenu.FUNDS, `/${RouterService.COMPANIES_URL}`));
        this.add(new ShellListItem('main.menu.becomePartner', ShellMenu.BECOME_PARTNER, `/${RouterService.COMPANIES_URL}`));
        this.add(new ShellListItem('main.menu.shop', ShellMenu.SHOP, `/${RouterService.COMPANIES_URL}`));
        this.add(new ShellListItem('main.menu.contacts', ShellMenu.CONTACTS, `/${RouterService.COMPANIES_URL}`));

        for (let item of this.collection) {
            item.action = item => router.navigate(item.data);
            item.checkSelected = item => router.isUrlActive(item.data, false);
        }
        merge(company.changed, user.logined, user.changed).pipe(takeUntil(this.destroyed)).subscribe(() => this.refresh());
        merge(router.finished).pipe(takeUntil(this.destroyed)).subscribe(() => this.refreshSelection());

        this.complete();
        this.refresh();
    }
}

export class ShellListItem extends SelectListItem<string> {
    constructor(translationId: string, sortIndex: number, url: string) {
        super(translationId, sortIndex, url);
        this.selectedClassName = 'active';
    }
}
