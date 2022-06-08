import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { RouterService } from '@core/service';
import { LedgerBlockMapCollection } from '@core/lib';
import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { Transport } from '@ts-core/common/transport';
import { BlockOpenCommand } from '../../transport';

@Component({
    selector: 'blocks',
    templateUrl: 'blocks.component.html'
})
export class BlocksComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @Input()
    public blocks: LedgerBlockMapCollection;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, public transport: Transport) {
        super();
        ViewUtil.addClasses(element, 'd-block');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public blockOpen(item: LedgerBlock): void {
        this.transport.send(new BlockOpenCommand(item));
    }
}
