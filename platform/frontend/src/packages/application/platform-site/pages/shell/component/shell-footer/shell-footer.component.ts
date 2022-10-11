import { Component, ElementRef } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { RouterService } from '@core/service';
import { ViewUtil } from '@ts-core/angular';
import { Transport } from '@ts-core/common';
import { ShellMenu } from '../../service';

@Component({
    selector: 'shell-footer',
    templateUrl: './shell-footer.component.html',
    styleUrls: ['./shell-footer.component.scss']
})
export class ShellFooterComponent extends Destroyable {
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
        ViewUtil.addClasses(element, 'd-block');
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
