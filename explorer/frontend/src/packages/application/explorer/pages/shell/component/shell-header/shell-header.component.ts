import { Component, EventEmitter, ElementRef, Output, Input } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ShellHeaderMenu } from '../../service';
import { RouterService, LedgerApiMonitor } from '@core/service';
import { ViewUtil } from '@ts-core/angular';
import { Transport } from '@ts-core/common/transport';
import { BlocksOpenCommand } from '@feature/block/transport';

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

    @Input()
    public isHasMenu: boolean;

    @Output()
    public openMenu: EventEmitter<void> = new EventEmitter();

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef, public menu: ShellHeaderMenu, public monitor: LedgerApiMonitor, private router: RouterService, private transport: Transport) {
        super();
        ViewUtil.addClasses(element, 'd-flex align-items-center');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public open(): void {
        this.openMenu.emit();
    }

    public back(): void {
        this.router.navigate('/');
    }
}
