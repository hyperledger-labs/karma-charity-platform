import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewUtil } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { takeUntil } from 'rxjs';

@Component({
    templateUrl: './block-page.component.html'
})
export class BlockPageComponent extends DestroyableContainer {

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _block: LedgerBlock;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ElementRef, route: ActivatedRoute) {
        super();
        ViewUtil.addClasses(container, 'd-block');
        route.data.pipe(takeUntil(this.destroyed)).subscribe(data => this._block = data.block);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get block(): LedgerBlock {
        return this._block;
    }
}
