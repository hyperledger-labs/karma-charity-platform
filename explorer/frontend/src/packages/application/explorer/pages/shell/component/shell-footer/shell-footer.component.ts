import { Component, ElementRef } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ShellHeaderMenu } from '../../service';
import { RouterService, SettingsService } from '@core/service';
import { ViewUtil } from '@ts-core/angular';

@Component({
    selector: 'shell-footer',
    templateUrl: './shell-footer.component.html',
    styleUrls: ['../shell-header/shell-header.component.scss']
})
export class ShellFooterComponent extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, public menu: ShellHeaderMenu, public settings: SettingsService, private router: RouterService) {
        super();
        ViewUtil.addClasses(element, 'd-flex align-items-center');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public open(): void {
        // this.router.navigate(RouterService.ABOUT_URL);
    }
}
