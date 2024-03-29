import { Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import { Transport } from '@ts-core/common';
import { PipeService, UserService } from '@core/service';
import * as _ from 'lodash';
import { ProjectMapCollection, ProjectTableSettings } from '@core/lib/project';
import { UserProject } from '@project/common/platform/user';
import { ProjectMenu } from '@feature/project/service';
import { ProjectOpenCommand } from '@feature/project/transport';

@Component({
    templateUrl: 'projects-page.component.html',
})
export class ProjectsPageComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    public settings: ICdkTableSettings<UserProject>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ElementRef,
        pipe: PipeService,
        user: UserService,
        private transport: Transport,
        public menu: ProjectMenu,
        public items: ProjectMapCollection
    ) {
        super();
        ViewUtil.addClasses(element, 'd-block background border rounded');

        this.settings = new ProjectTableSettings(pipe, user);
        if (!this.items.isDirty) {
            this.items.reload();
        }
        
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------



    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<UserProject>): Promise<void> {
        if (item.column !== ProjectTableSettings.COLUMN_NAME_MENU) {
            this.transport.send(new ProjectOpenCommand(item.data.id));
        }
        else {
            this.menu.refresh(item.data);
            this.trigger.openMenuOn(item.event.target);
        }
    }

}
