import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { LoadingService, LoadingServiceManager } from '@ts-core/frontend';
import { LoadableEvent } from '@ts-core/common';
import * as _ from 'lodash';
import { ApplicationComponent, ViewUtil, WindowService } from '@ts-core/angular';
import { TransportHttpCommandAsync } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { ThemeService } from '@ts-core/frontend';
import { RouterService, SettingsService, LoginService, EnvironmentService } from '@core/service';
import { AssetsCdnProvider, LanguageLoader } from '@core/lib';
import { Language } from '@ts-core/language';
import { takeUntil, filter } from 'rxjs';

import { RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import 'numeral/locales/ru';
import 'moment/locale/ru';
import { ExtendedError } from '@ts-core/common';
import { Assets } from '@ts-core/frontend';
import { ObjectUtil } from '@ts-core/common';
import { LanguageFileLoader } from '@ts-core/language';
import { Transport } from '@ts-core/common';
import { Client, ErrorCode } from '@common/platform/api';

// import { LOCALE_PREFIXES } from '@common/platform/api/locale';
export const LOCALE_PREFIXES = [
    '.json',
    'Main.json',
    'Custom.json'
]

@Component({
    selector: 'root',
    templateUrl: 'root.component.html',
    styleUrls: ['root.component.scss']
})
export class RootComponent extends ApplicationComponent<SettingsService> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public isLoading: boolean;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        private element: ElementRef,
        private transport: Transport,
        private api: Client,
        private login: LoginService,
        private router: RouterService,
        private windows: WindowService,
        private environment: EnvironmentService,
        protected renderer: Renderer2,
        protected settings: SettingsService,
        protected language: LanguageService,
        protected theme: ThemeService,
        public loading: LoadingService,
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

    protected initializeLanguage(): void {
        super.initializeLanguage();
        this.language.loader = this.settings.isProduction ? new LanguageLoader(this.api, this.settings) : new LanguageFileLoader(`${this.settings.assetsUrl}language/`, LOCALE_PREFIXES);
    }

    protected initializeAssets(): void {
        Assets.provider = new AssetsCdnProvider(this.settings.assetsUrl, this.settings.assetsCdnUrl);
    }

    private initializeObservers(): void {
        let manager = this.addDestroyable(new LoadingServiceManager(this.loading));
        manager.addLoadable(this.language, this.login, this.api);

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loading.start();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loading.finish();
            }
        });

        this.api.events.pipe(
            filter(data => data.type === LoadableEvent.ERROR),
            takeUntil(this.destroyed))
            .subscribe(data => this.apiLoadingError(data.data as TransportHttpCommandAsync<any>));

        this.login.logouted.pipe(takeUntil(this.destroyed)).subscribe(() => this.router.navigate(RouterService.DEFAULT_URL));
    }

    private async loginIfNeed(): Promise<void> {
        if (this.login.isLoggedIn || !this.login.isAutoLogin) {
            return;
        }

        let data = await this.environment.check();
        if (!_.isNil(data)) {
            this.login.login(data);
        }
        else {
            this.login.loginBySidIfCan();
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected async apiLoadingError<T>(command: TransportHttpCommandAsync<T>): Promise<void> {
        let error: ExtendedError<any, string | number> = command.error;
        let translateId = `error.${error.code}`;
        let translation = { code: error.code, message: error.message } as any;

        if (error.code === ExtendedError.HTTP_CODE_UNAUTHORIZED) {
            this.windows.info(translateId, translation, null, { id: `error.${error.code}` });
            await this.login.logout();
            return;
        }
        if (!command.isHandleError) {
            return;
        }
        if (ObjectUtil.isJSON(error.details)) {
            translation = JSON.parse(error.details);
            if (_.isEmpty(translation.message)) {
                translation.message = error.message;
            }
        }
        /*
        switch (error.code) {
            case ErrorCode.TAROT_SPREAD_EXCEED:
                translation.value = this.language.translate('format.tarotSpreadPlural', { spreads: translation.value })
                translation.expected = this.language.translate('format.tarotSpreadPlural', { spreads: translation.expected })
                break;
        }
        */
        this.windows.info(translateId, translation);
    }

    protected languageLoadingError(item: Language, error: Error): void {
        let message = `Unable to load language "${item.locale}"`;
        if (!_.isNil(error)) {
            message += `, error: ${error}`;
        }
        this.router.navigate(`${RouterService.MESSAGE_URL}/${message}`);
    }

    protected async readyHandler(): Promise<void> {
        this.loginIfNeed();
    }
}


