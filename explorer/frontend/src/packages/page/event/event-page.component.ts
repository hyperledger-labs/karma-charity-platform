import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewUtil } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { takeUntil } from 'rxjs';

@Component({
    templateUrl: './event-page.component.html'
})
export class EventPageComponent extends DestroyableContainer {

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _event: LedgerBlockEvent;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ElementRef, route: ActivatedRoute) {
        super();
        ViewUtil.addClasses(container, 'd-block');
        route.data.pipe(takeUntil(this.destroyed)).subscribe(data => this._event = data.event);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get event(): LedgerBlockEvent {
        return this._event;
    }
}
