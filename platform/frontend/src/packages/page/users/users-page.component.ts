import { Component, ElementRef, ViewChild } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { LedgerUser } from '@common/ledger/user';
import { PipeService, UserService } from '../../module/core/service';
import { UserMapCollection, UserTableSettings } from '../../module/core/lib/user';
import * as _ from 'lodash';
import { User } from '@common/platform/user';
import { PaymentWidgetOpenCommand } from '../../module/feature/payment/transport';
import { CoinObjectType } from '@common/transport/command/coin';
import { UserMenu } from '../../module/feature/user/service';
import { UserOpenCommand } from '../../module/feature/user/transport';

@Component({
    templateUrl: 'users-page.component.html',
})
export class UsersPageComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;
    public settings: ICdkTableSettings<User>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ElementRef,
        pipe: PipeService,
        user: UserService,
        public menu: UserMenu,
        private transport: Transport,
        public items: UserMapCollection
    ) {
        super();
        ViewUtil.addClasses(element, 'd-block background border rounded');

        this.settings = new UserTableSettings(pipe, user);
        if (!this.items.isDirty) {
            this.items.reload();
        }

        /*
        merge(api.monitor.getEventDispatcher(UserAddedEvent.NAME), api.monitor.getEventDispatcher(UserRemovedEvent.NAME))
            .pipe(delay(DateUtil.MILISECONDS_SECOND), takeUntil(this.destroyed))
            .subscribe(() => this.items.reload());
        */
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<User>): Promise<void> {
        if (item.column !== UserTableSettings.COLUMN_NAME_MENU) {
            this.transport.send(new UserOpenCommand(item.data.id));
        }
        else {
            this.menu.refresh(item.data);
            this.trigger.openMenuOn(item.event.target);
        }
    }

}
