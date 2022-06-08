import { Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import { PipeService, UserService } from '../../module/core/service';
import * as _ from 'lodash';
import { CompanyMapCollection, CompanyTableSettings } from '../../module/core/lib/company';
import { UserCompany } from 'common/platform/user';
import { CompanyMenu } from '../../module/feature/company/service';
import { Transport } from '@ts-core/common/transport';
import { CompanyOpenCommand } from '../../module/feature/company/transport';

@Component({
    templateUrl: 'companies-page.component.html',
})
export class CompaniesPageComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    public settings: ICdkTableSettings<UserCompany>;

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
        public menu: CompanyMenu,
        public items: CompanyMapCollection
    ) {
        super();
        ViewUtil.addClasses(element, 'd-block background border rounded');

        this.settings = new CompanyTableSettings(pipe, user);
        if (!this.items.isDirty) {
            this.items.reload();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<UserCompany>): Promise<void> {
        if (item.column !== CompanyTableSettings.COLUMN_NAME_MENU) {
            this.transport.send(new CompanyOpenCommand(item.data.id));
        }
        else {
            this.menu.refresh(item.data);
            this.trigger.openMenuOn(item.event.target);
        }
    }

}
