import { Component, ElementRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';

@Component({
    templateUrl: 'main-page.component.html',
})
export class MainPageComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ElementRef
    ) {
        super();
        ViewUtil.addClasses(element, 'd-block background border rounded');
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------



}
