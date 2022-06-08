import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockEvent, LedgerInfo } from '@hlf-explorer/common/ledger';
import { Transport } from '@ts-core/common/transport';
import { EventOpenCommand, EventsOpenCommand } from '../../transport';

@Component({
    selector: 'events-last',
    templateUrl: 'events-last.component.html'
})
export class EventsLastComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _ledger: LedgerInfo;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, private transport: Transport) {
        super();
        ViewUtil.addClasses(element, 'd-block');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitLedgerProperties(): void { }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public eventOpen(item: LedgerBlockEvent): void {
        this.transport.send(new EventOpenCommand(item));
    }

    public eventsOpen(): void {
        this.transport.send(new EventsOpenCommand());
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get ledger(): LedgerInfo {
        return this._ledger;
    }

    @Input()
    public set ledger(value: LedgerInfo) {
        if (value === this._ledger) {
            return;
        }
        this._ledger = value;

        if (this._ledger) {
            this.commitLedgerProperties();
        }
    }
}
