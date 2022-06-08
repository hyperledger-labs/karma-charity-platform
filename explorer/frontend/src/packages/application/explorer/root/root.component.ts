import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { LoadingService, LoadingServiceManager } from '@ts-core/frontend/service';
import { LoadableEvent } from '@ts-core/common';
import * as _ from 'lodash';

import { ApplicationComponent, LoginResolver, NotificationService, ViewUtil, WindowService } from '@ts-core/angular';
import { TransportHttp, TransportHttpCommandAsync } from '@ts-core/common/transport/http';
import { LanguageService } from '@ts-core/frontend/language';
import { ThemeService } from '@ts-core/frontend/theme';
import { RouterService, SettingsService } from '@core/service';
import { Language } from '@ts-core/language';
import { takeUntil, filter, map } from 'rxjs';
import { RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import 'numeral/locales/ru';
import 'moment/locale/ru';
import { LedgerApiMonitor } from '@core/service';
import { BLOCK_URL, LedgerApiClient } from '@hlf-explorer/common/api';
import { ILedgerBlockGetRequest, ILedgerBlockGetResponse } from '@hlf-explorer/common/api/block';
import { TransformUtil } from '@ts-core/common/util';
import { LedgerBlock } from '@hlf-explorer/common/ledger';

@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent extends ApplicationComponent<SettingsService> {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        public loading: LoadingService,
        private element: ElementRef,
        private windows: WindowService,
        private api: LedgerApiClient,
        private monitor: LedgerApiMonitor,
        private router: RouterService,
        protected renderer: Renderer2,
        protected settings: SettingsService,
        protected language: LanguageService,
        protected theme: ThemeService,
        icon: MatIconRegistry
    ) {
        super();
        icon.setDefaultFontSetClass('fas');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected initialize(): void {
        super.initialize();
        ViewUtil.addClasses(this.element, 'd-block h-100');

        this.initializeObservers();

        this.theme.loadIfExist(this.settings.theme);
        this.language.loadIfExist(this.settings.language);
    }

    private initializeObservers(): void {
        let manager = this.addDestroyable(new LoadingServiceManager(this.loading));
        manager.addLoadable(this.language, this.monitor, this.api);

        this.api.events
            .pipe(filter(event => event.type === LoadableEvent.ERROR))
            .pipe(map(<T>(event) => event.data as TransportHttpCommandAsync<T>))
            .pipe(takeUntil(this.destroyed))
            .subscribe(data => this.apiLoadingError(data));

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loading.start();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loading.finish();
            }
        });
    }


    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected async apiLoadingError<T>(command: TransportHttpCommandAsync<T>): Promise<void> {
        let error = command.error;
        if (command.isHandleError) {
            this.windows.info(error.message);
        }
    }

    protected languageLoadingError(item: Language, error: Error): void {
        let message = `Unable to load language "${item.locale}"`;
        if (!_.isNil(error)) {
            message += `, error: ${error}`;
        }
        this.router.navigate(`${RouterService.MESSAGE_URL}/${message}`);
    }

    protected async readyHandler(): Promise<void> {
        this.monitor.connect();
    }
}
