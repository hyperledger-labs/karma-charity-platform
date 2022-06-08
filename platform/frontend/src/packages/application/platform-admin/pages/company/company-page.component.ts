import { Component, ElementRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import { CompanyService } from '../../../../module/core/service';
import * as _ from 'lodash';

@Component({
    templateUrl: 'company-page.component.html',
})
export class CompanyPageComponent extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        element: ElementRef,
        public service: CompanyService,
    ) {
        super();
        ViewUtil.addClasses(element, 'd-flex scroll-vertical w-100 h-100');
    }
}
