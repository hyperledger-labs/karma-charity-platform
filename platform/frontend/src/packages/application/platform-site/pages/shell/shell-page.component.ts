import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NotificationService, ShellBaseComponent, ViewUtil } from '@ts-core/angular';
import { RouterService, PipeService, SettingsService } from '@core/service';
import { filter, takeUntil } from 'rxjs';
import { ShellMenu } from './service';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    templateUrl: './shell-page.component.html',
    styleUrls: ['./shell-page.component.scss']
})
export class ShellPageComponent extends ShellBaseComponent implements AfterViewInit {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild('container', { static: true })
    public container: CdkScrollable;
    public isNeedScrollButton: boolean = false;

    public version: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        notifications: NotificationService,
        breakpointObserver: BreakpointObserver,
        router: RouterService,
        element: ElementRef,
        pipe: PipeService,
        public settings: SettingsService,
        public menu: ShellMenu
    ) {
        super(notifications, breakpointObserver);
        ViewUtil.addClasses(element, 'd-block w-100 h-100 vertical-scroll-only');

        this.version = pipe.language.translate('general.footer', { version: this.settings.version, versionDate: pipe.momentDate.transform(this.settings.versionDate, 'LLL'), });
        router.completed.pipe(
            filter(() => !router.isUrlActive(router.previousUrl)),
            takeUntil(this.destroyed)).subscribe(() => this.scrollTop());
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    public async ngAfterViewInit(): Promise<void> {
        this.initialize();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public scrollTop(): void {
        // this.container.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
