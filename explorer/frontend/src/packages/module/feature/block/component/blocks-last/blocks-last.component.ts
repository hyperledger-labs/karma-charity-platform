import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlock, LedgerInfo } from '@hlf-explorer/common/ledger';
import { RouterService } from '@core/service';
import { Transport } from '@ts-core/common/transport';
import { BlocksOpenCommand, BlockOpenCommand } from '../../transport';

@Component({
    selector: 'blocks-last',
    templateUrl: 'blocks-last.component.html'
})
export class BlocksLastComponent extends DestroyableContainer {
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

    public blockOpen(item: LedgerBlock): void {
        this.transport.send(new BlockOpenCommand(item));
    }
    
    public blocksOpen(): void {
        this.transport.send(new BlocksOpenCommand());
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
