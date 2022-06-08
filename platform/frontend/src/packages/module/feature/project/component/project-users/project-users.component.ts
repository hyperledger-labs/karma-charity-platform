import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { ProjectBaseComponent } from '../ProjectBaseComponent';
import { ProjectUserMapCollection, ProjectUserTableSettings } from '../../../../core/lib/project';
import { ProjectUser } from '@project/common/platform/project/ProjectUser';
import { PipeService, UserService } from '../../../../core/service';
import { ProjectUserMenu } from '../../service';
import { UserOpenCommand } from '../../../user/transport';
import { Transport } from '@ts-core/common/transport';
import { Project } from '@project/common/platform/project';
import { ProjectUserAddCommand } from '../../transport';
import { PermissionUtil } from 'common/util';
import { UserProject } from 'common/platform/user';

@Component({
    selector: 'project-users',
    templateUrl: 'project-users.component.html',
    providers: [ProjectUserMapCollection]
})
export class ProjectUsersComponent extends ProjectBaseComponent {

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    public settings: ICdkTableSettings<ProjectUser>;

    public isCanRole: boolean;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef,
        private pipe: PipeService,
        private user: UserService,
        private transport: Transport,
        public items: ProjectUserMapCollection,
        public menu: ProjectUserMenu
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitProjectProperties(): void {
        super.commitProjectProperties();

        this.items.projectId = this.project.id;
        this.settings = new ProjectUserTableSettings(this.pipe, this.user);

        this.isCanRole = PermissionUtil.isCanProjectUserEdit(this.project.roles);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async add(): Promise<void> {
        await this.transport.sendListen(new ProjectUserAddCommand({ projectId: this.project.id }));
        this.items.reload();
    }

    public async cellClickedHandler(item: ICdkTableCellEvent<ProjectUser>): Promise<void> {
        if (item.column !== ProjectUserTableSettings.COLUMN_NAME_MENU) {
            this.transport.send(new UserOpenCommand(item.data.id));
        }
        else {
            this.menu.refresh(this.project, item.data);
            this.trigger.openMenuOn(item.event.target);
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.items)) {
            this.items.destroy();
            this.items = null;
        }

        this.settings = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get project(): UserProject {
        return super.project;
    }
    @Input()
    public set project(value: UserProject) {
        super.project = value;
    }

}
