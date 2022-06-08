import { Component, ViewContainerRef, Input } from '@angular/core';
import { ViewUtil, IWindowContent } from '@ts-core/angular';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import * as _ from 'lodash';
import { LedgerBlockEventWrapper } from '@core/lib';
import { Transport } from '@ts-core/common/transport';
import { TransactionOpenCommand } from '@feature/transaction/transport';
import { BlockOpenCommand } from '@feature/block/transport';

@Component({
    selector: 'event-details',
    templateUrl: 'event-details.component.html'
})
export class EventDetailsComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public wrapper: LedgerBlockEventWrapper;

    public eventData: string;
    public initiatorId: string;

    private _event: LedgerBlockEvent;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef, private transport: Transport) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitEventProperties(): void {
        let value = null;

        let event = (this.wrapper = new LedgerBlockEventWrapper(this.event));

        value = event.eventData;
        if (value !== this.eventData) {
            this.eventData = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public blockOpen(item: number): void {
        this.transport.send(new BlockOpenCommand(item));
    }

    public transactionOpen(item: string): void {
        this.transport.send(new TransactionOpenCommand(item));
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get event(): LedgerBlockEvent {
        return this._event;
    }

    @Input()
    public set event(value: LedgerBlockEvent) {
        if (value === this._event) {
            return;
        }
        this._event = value;
        if (this._event) {
            this.commitEventProperties();
        }
    }
}
