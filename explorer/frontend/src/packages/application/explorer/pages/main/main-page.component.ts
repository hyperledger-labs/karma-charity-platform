import { Component, ElementRef } from '@angular/core';
import { LedgerApiMonitor } from '@core/service';
import { ViewUtil } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import { Transport } from '@ts-core/common/transport';
import { BlocksOpenCommand } from '@feature/block/transport';

@Component({
    templateUrl: 'main-page.component.html'
})
export class MainPageComponent extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, public monitor: LedgerApiMonitor) {
        super();
        ViewUtil.addClasses(element, 'd-block container');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------


}
