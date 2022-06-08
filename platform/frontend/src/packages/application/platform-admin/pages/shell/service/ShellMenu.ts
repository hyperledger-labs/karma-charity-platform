import { ISelectListItem, SelectListItem, SelectListItems } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { UserService, CompanyService, RouterService } from '../../../../../module/core/service';
import { takeUntil } from 'rxjs';
import { CompanyGuard, CompaniesGuard } from '../../../../../module/feature/company/guard';
import { merge } from 'rxjs';
import { UsersGuard } from '../../../../../module/feature/user/guard';
import { ProjectsGuard } from '../../../../../module/feature/project/guard';
import { PaymentsGuard } from '../../../../../module/feature/payment/guard';

@Injectable()
export class ShellMenu extends SelectListItems<ISelectListItem<string>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static USERS = 0;
    private static USER = 9;
    private static COMPANY = 10;
    private static COMPANIES = 20;
    private static PROJECTS = 30;
    private static PAYMENTS = 40;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService,
        user: UserService,
        company: CompanyService,
        router: RouterService,
        usersGuard: UsersGuard,
        companyGuard: CompanyGuard,
        companiesGuard: CompaniesGuard,
        paymentsGuard: PaymentsGuard,
        projectsGuard: ProjectsGuard) {

        super(language);

        let item: ISelectListItem = null;

        item = this.add(new ShellListItem('user.users', ShellMenu.USERS, `/${RouterService.USERS_URL}`, 'fas fa-users'));
        item.checkEnabled = () => usersGuard.canActivate() === true;

        item = this.add(new ShellListItem('user.user', ShellMenu.USER, `/${RouterService.USER_URL}`, 'fas fa-user'));

        item = this.add(new ShellListItem('company.company', ShellMenu.COMPANY, `/${RouterService.COMPANY_URL}`, 'fas fa-building'));
        item.checkEnabled = () => companyGuard.canActivate() === true;

        item = this.add(new ShellListItem('company.companies', ShellMenu.COMPANIES, `/${RouterService.COMPANIES_URL}`, 'fas fa-building-columns'));
        item.checkEnabled = () => companiesGuard.canActivate() === true;

        item = this.add(new ShellListItem('project.projects', ShellMenu.PROJECTS, `/${RouterService.PROJECTS_URL}`, 'fas fa-hands-helping'));
        item.checkEnabled = () => projectsGuard.canActivate() === true;

        item = this.add(new ShellListItem('payment.payments', ShellMenu.PAYMENTS, `/${RouterService.PAYMENTS_URL}`, 'fas fa-coins'));
        item.checkEnabled = () => paymentsGuard.canActivate() === true;

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
    constructor(translationId: string, sortIndex: number, url: string, iconId: string, className?: string) {
        super(translationId, sortIndex, url);
        this.iconId = iconId;
        this.className = className;
        this.selectedClassName = 'active';
    }
}
