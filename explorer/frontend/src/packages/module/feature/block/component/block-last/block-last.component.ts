import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { PipeService } from '@core/service';
import * as _ from 'lodash';

@Component({
    selector: 'block-last',
    templateUrl: 'block-last.component.html'
})
export class BlockLastComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _block: LedgerBlock;

    public date: string;
    public number: string;
    public events: string;
    public transactions: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, private pipe: PipeService) {
        super();
        ViewUtil.addClasses(element, 'd-flex flex-grow-1 align-items-center');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitBlockProperties(): void {
        let value = null;

        value = this.pipe.momentDateFromNow.transform(this.block.createdDate, null);
        if (value !== this.date) {
            this.date = value;
        }

        value = `# ${this.block.number}`;
        if (value !== this.number) {
            this.number = value;
        }

        value = !_.isEmpty(this.block.transactions) ? this.block.transactions.length : 0;
        if (value !== this.transactions) {
            this.transactions = value;
        }

        value = !_.isEmpty(this.block.events) ? this.block.events.length : 0;
        if (value !== this.events) {
            this.events = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get block(): LedgerBlock {
        return this._block;
    }
    @Input()
    public set block(value: LedgerBlock) {
        if (value === this._block) {
            return;
        }
        this._block = value;
        if (this._block) {
            this.commitBlockProperties();
        }
    }
}
