import { Component, ElementRef } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { RouterService } from '@core/service';
import { ViewUtil } from '@ts-core/angular';
import { Transport } from '@ts-core/common';
import { ShellMenu } from '../../service';

@Component({
    selector: 'shell-header',
    templateUrl: './shell-header.component.html',
    styleUrls: ['./shell-header.component.scss']
})
export class ShellHeaderComponent extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, public menu: ShellMenu, private router: RouterService, private transport: Transport) {
        super();
        ViewUtil.addClasses(element, 'd-flex align-items-center justify-content-center');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public back(): void {
        this.router.navigate('/');
    }
}
