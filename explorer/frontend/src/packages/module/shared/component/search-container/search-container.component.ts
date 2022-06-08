import { Component, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { RouterService, LedgerApiMonitor } from '@core/service';
import { SearchContainerBaseComponent } from '../SearchContainerBaseComponent';
import { ViewUtil } from '@ts-core/angular';
import { LedgerApiClient } from '@hlf-explorer/common/api';
import { Transport } from '@ts-core/common/transport';

@Component({
    selector: 'search-container',
    templateUrl: 'search-container.component.html'
})
export class SearchContainerComponent extends SearchContainerBaseComponent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public query: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, transport: Transport, api: LedgerApiClient, router: RouterService, public monitor: LedgerApiMonitor) {
        super(router, transport, api);
        ViewUtil.addClasses(element, 'd-flex background border rounded');
    }
}
