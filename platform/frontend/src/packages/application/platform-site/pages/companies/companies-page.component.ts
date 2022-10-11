import { Component, ElementRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { PipeService, UserService } from '@core/service';
import * as _ from 'lodash';

@Component({
    templateUrl: 'companies-page.component.html',
})
export class CompaniesPageComponent extends DestroyableContainer {
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
        element: ElementRef,
        pipe: PipeService,
        user: UserService
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
