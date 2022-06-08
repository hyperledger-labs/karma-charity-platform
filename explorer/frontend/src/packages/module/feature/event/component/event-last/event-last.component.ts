import { Component, ElementRef, Input } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { PipeService } from '@core/service';
import * as _ from 'lodash';
import { LedgerBlockEventWrapper } from '@core/lib';

@Component({
    selector: 'event-last',
    templateUrl: 'event-last.component.html'
})
export class EventLastComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _event: LedgerBlockEvent;

    public name: string;
    public date: string;
    public data: string;

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

    private commitEventProperties(): void {
        let value = null;

        let event = new LedgerBlockEventWrapper(this.event);

        value = this.pipe.momentDateFromNow.transform(event.createdDate, null);
        if (value !== this.date) {
            this.date = value;
        }

        value = event.name;
        if (value !== this.name) {
            this.name = value;
        }
        value = event.eventData;
        if (value !== this.data) {
            this.data = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
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
