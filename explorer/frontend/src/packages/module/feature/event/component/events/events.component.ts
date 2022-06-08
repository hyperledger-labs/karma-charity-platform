import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockEventMapCollection } from '@core/lib';
import { Transport } from '@ts-core/common/transport';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { EventOpenCommand } from '../../transport';

@Component({
    selector: 'events',
    templateUrl: 'events.component.html'
})
export class EventsComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @Input()
    public events: LedgerBlockEventMapCollection;

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
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public eventOpen(item: LedgerBlockEvent): void {
        this.transport.send(new EventOpenCommand(item));
    }

}
