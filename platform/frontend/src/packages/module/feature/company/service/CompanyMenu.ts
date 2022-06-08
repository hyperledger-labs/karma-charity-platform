import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common/transport';
import { UserService } from '../../../core/service';
import { UserCompany } from 'common/platform/user';
import { CompanyVerifyCommand, CompanyToVerifyCommand, CompanyRejectCommand, CompanyActivateCommand, CompanyEditCommand } from '../transport';
import { ProjectAddCommand } from '../../project/transport';
import { CompanyUtil } from '@project/common/platform/company';

@Injectable({ providedIn: 'root' })
export class CompanyMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static TO_VERIFY = 10;
    private static VERIFY = 20;
    private static REJECT = 30;
    private static ACTIVATE = 40;
    private static EDIT = 50;

    private static PROJECT_ADD = 60;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, private user: UserService) {
        super(language);

        let item: MenuListItem = null;

        item = new ListItem('company.action.toVerify.toVerify', CompanyMenu.TO_VERIFY, null, 'fas fa-arrow-right me-2');
        item.checkEnabled = (item, company) => this.isCanToVerify(company);
        item.action = (item, company) => transport.send(new CompanyToVerifyCommand());
        item.className = 'text-success';
        this.add(item);

        item = new ListItem('company.action.activate.activate', CompanyMenu.ACTIVATE, null, 'fas fa-check me-2');
        item.checkEnabled = (item, company) => this.isCanActivate(company);
        item.action = (item, company) => transport.send(new CompanyActivateCommand());
        item.className = 'text-success';
        this.add(item);

        item = new ListItem('company.action.verify.verify', CompanyMenu.VERIFY, null, 'fas fa-check me-2');
        item.checkEnabled = (item, company) => this.isCanVerify(company);
        item.action = (item, company) => transport.send(new CompanyVerifyCommand(company));
        item.className = 'text-success';
        this.add(item);

        item = new ListItem('company.action.reject.reject', CompanyMenu.REJECT, null, 'fas fa-times me-2');
        item.checkEnabled = (item, company) => this.isCanReject(company);
        item.action = (item, company) => transport.send(new CompanyRejectCommand(company));
        item.className = 'text-danger';
        this.add(item);

        item = new ListItem('company.action.edit.edit', CompanyMenu.EDIT, null, 'fas fa-edit me-2');
        item.checkEnabled = (item, company) => this.isCanEdit(company);
        item.action = (item, company) => transport.send(new CompanyEditCommand(company.id));
        this.add(item);

        item = new ListItem('project.action.add.add', CompanyMenu.PROJECT_ADD, null, 'fas fa-cube me-2');
        item.checkEnabled = (item, company) => this.isCanProjectAdd(company);
        item.action = (item, company) => transport.send(new ProjectAddCommand());
        this.add(item);

        this.complete();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private isCanEdit(company: UserCompany): boolean {
        return this.user.isAdministrator || CompanyUtil.isCanEdit(company);
    }
    private isCanVerify(company: UserCompany): boolean {
        return (this.user.isEditor || this.user.isAdministrator) && CompanyUtil.isCanVerify(company);
    }
    private isCanReject(company: UserCompany): boolean {
        return (this.user.isEditor || this.user.isAdministrator) && CompanyUtil.isCanReject(company);
    }
    private isCanActivate(company: UserCompany): boolean {
        return CompanyUtil.isCanActivate(company);
    }
    private isCanToVerify(company: UserCompany): boolean {
        return CompanyUtil.isCanToVerify(company);
    }
    private isCanProjectAdd(company: UserCompany): boolean {
        return CompanyUtil.isCanProjectAdd(company);
    }
}

class MenuListItem extends ListItem<void> {
    action: (item: ListItem, company: UserCompany) => void;
    checkEnabled: (item: ListItem, company: UserCompany) => boolean;
}
