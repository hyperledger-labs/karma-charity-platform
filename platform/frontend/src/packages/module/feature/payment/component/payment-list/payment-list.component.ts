import { Component, ElementRef, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ICdkTableCellEvent, ICdkTableSettings, MenuTriggerForDirective, ViewUtil } from '@ts-core/angular';
import { PipeService } from '../../../../core/service';
import * as _ from 'lodash';
import { PaymentMapCollection, PaymentTableSettingsType, PaymentTableSettings } from '../../../../core/lib/payment';
import { PaymentMenu } from '../../service';
import { Transport } from '@ts-core/common/transport';
import { PaymentOpenCommand } from '../../transport';
import { Payment } from '@project/common/platform/payment';

@Component({
    selector: 'payment-list',
    templateUrl: 'payment-list.component.html',
})
export class PaymentListComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    @ViewChild(MenuTriggerForDirective, { static: true })
    public trigger: MenuTriggerForDirective;

    protected _type: string;
    protected _items: PaymentMapCollection;
    protected _settings: ICdkTableSettings<Payment>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private pipe: PipeService,
        private transport: Transport,
        public menu: PaymentMenu
    ) {
        super();
        ViewUtil.addClasses(container, 'd-flex');
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitTypeProperties(): void {
        this._settings = new PaymentTableSettings(this.type as PaymentTableSettingsType, this.pipe);
    }

    protected commitItemsProperties(): void {
        if (!this.items.isDirty) {
            this.items.reload();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async cellClickedHandler(item: ICdkTableCellEvent<Payment>): Promise<void> {
        switch (item.column) {
            case (PaymentTableSettings.COLUMN_NAME_MENU):
                this.menu.refresh(item.data);
                this.trigger.openMenuOn(item.event.target);
                break;
            default:
                this.transport.send(new PaymentOpenCommand(item.data.id));
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this._settings = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get settings(): ICdkTableSettings<Payment> {
        return this._settings;
    }

    public get items(): PaymentMapCollection {
        return this._items;
    }
    @Input()
    public set items(value: PaymentMapCollection) {
        if (value === this._items) {
            return;
        }
        this._items = value;
        if (!_.isNil(value)) {
            this.commitItemsProperties();
        }
    }

    public get type(): string {
        return this._type;
    }
    @Input()
    public set type(value: string) {
        if (value === this._type) {
            return;
        }
        this._type = value;
        if (!_.isNil(value)) {
            this.commitTypeProperties();
        }
    }

}
