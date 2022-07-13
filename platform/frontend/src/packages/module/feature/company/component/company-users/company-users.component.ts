import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { CompanyBaseComponent } from '../CompanyBaseComponent';
import { CompanyUserMapCollection, CompanyUserTableSettings } from '@core/lib/company';
import { CompanyUser } from '@project/common/platform/company/CompanyUser';
import { PipeService, UserService } from '@core/service';
import { CompanyUserMenu } from '../../service';
import { UserOpenCommand } from '@feature/user/transport';
import { Transport } from '@ts-core/common/transport';
import { Company, CompanyUtil } from '@project/common/platform/company';
import { UserCompany } from '@project/common/platform/user';
import { PermissionUtil } from '@project/common/util';
import { CompanyUserAddCommand } from '../../transport';

@Component({
    selector: 'company-users',
    templateUrl: 'company-users.component.html',
    providers: [CompanyUserMapCollection]
})
export class CompanyUsersComponent extends CompanyBaseComponent {

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    public settings: ICdkTableSettings<CompanyUser>;

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
        public items: CompanyUserMapCollection,
        public menu: CompanyUserMenu
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitCompanyProperties(): void {
        super.commitCompanyProperties();

        this.items.companyId = this.company.id;
        this.settings = new CompanyUserTableSettings(this.pipe, this.user);

        this.isCanRole = CompanyUtil.isCanUserRoleSet(this.company);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async add(): Promise<void> {
        await this.transport.sendListen(new CompanyUserAddCommand({ companyId: this.company.id }));
        this.items.reload();
    }

    public async cellClickedHandler(item: ICdkTableCellEvent<CompanyUser>): Promise<void> {
        if (item.column !== CompanyUserTableSettings.COLUMN_NAME_MENU) {
            this.transport.send(new UserOpenCommand(item.data.id));
        }
        else {
            this.menu.refresh(this.company, item.data);
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

    public get company(): UserCompany {
        return super.company;
    }
    @Input()
    public set company(value: UserCompany) {
        super.company = value;
    }

}
