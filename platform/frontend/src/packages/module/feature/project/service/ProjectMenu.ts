import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common/transport';
import { UserService } from '@core/service';
import { UserProject } from '@project/common/platform/user';
import { ProjectVerifyCommand, ProjectToVerifyCommand, ProjectRejectCommand, ProjectActivateCommand, ProjectEditCommand } from '../transport';
import { ProjectUtil } from '@project/common/platform/project';

@Injectable({ providedIn: 'root' })
export class ProjectMenu extends ListItems<IListItem<void>> {
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

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, private user: UserService) {
        super(language);

        let item: MenuListItem = null;

        item = new ListItem('project.action.toVerify.toVerify', ProjectMenu.TO_VERIFY, null, 'fas fa-arrow-right me-2');
        item.checkEnabled = (item, project) => this.isCanToVerify(project);
        item.action = (item, project) => transport.send(new ProjectToVerifyCommand(project));
        item.className = 'text-success';
        this.add(item);

        item = new ListItem('project.action.activate.activate', ProjectMenu.ACTIVATE, null, 'fas fa-check me-2');
        item.checkEnabled = (item, project) => this.isCanActivate(project);
        item.action = (item, project) => transport.send(new ProjectActivateCommand(project));
        item.className = 'text-success';
        this.add(item);

        item = new ListItem('project.action.verify.verify', ProjectMenu.VERIFY, null, 'fas fa-check me-2');
        item.checkEnabled = (item, project) => this.isCanVerify(project);
        item.action = (item, project) => transport.send(new ProjectVerifyCommand(project));
        item.className = 'text-success';
        this.add(item);

        item = new ListItem('project.action.edit.edit', ProjectMenu.EDIT, null, 'fas fa-edit me-2');
        item.checkEnabled = (item, project) => this.isCanEdit(project);
        item.action = (item, project) => transport.send(new ProjectEditCommand(project.id));
        this.add(item);

        item = new ListItem('project.action.reject.reject', ProjectMenu.REJECT, null, 'fas fa-times me-2');
        item.checkEnabled = (item, project) => this.isCanReject(project);
        item.action = (item, project) => transport.send(new ProjectRejectCommand(project));
        item.className = 'text-danger';
        this.add(item);

        this.complete();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private isCanEdit(project: UserProject): boolean {
        return ProjectUtil.isCanEdit(project);
    }
    private isCanVerify(project: UserProject): boolean {
        return (this.user.isEditor || this.user.isAdministrator) && ProjectUtil.isCanVerify(project);
    }
    private isCanReject(project: UserProject): boolean {
        return (this.user.isEditor || this.user.isAdministrator) && ProjectUtil.isCanReject(project);
    }
    private isCanActivate(project: UserProject): boolean {
        return ProjectUtil.isCanActivate(project);
    }
    private isCanToVerify(project: UserProject): boolean {
        return ProjectUtil.isCanToVerify(project);
    }
}

class MenuListItem extends ListItem<void> {
    action: (item: ListItem, project: UserProject) => void;
    checkEnabled: (item: ListItem, project: UserProject) => boolean;
}
