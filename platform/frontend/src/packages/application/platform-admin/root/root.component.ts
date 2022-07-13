import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { LoadingService, LoadingServiceManager } from '@ts-core/frontend/service';
import { LoadableEvent } from '@ts-core/common';
import * as _ from 'lodash';
import { ApplicationComponent, ViewUtil, WindowService } from '@ts-core/angular';
import { TransportHttpCommandAsync } from '@ts-core/common/transport/http';
import { LanguageService } from '@ts-core/frontend/language';
import { ThemeService } from '@ts-core/frontend/theme';
import { RouterService, SettingsService } from '@core/service';
import { Language } from '@ts-core/language';
import { takeUntil, filter, map, merge, delay } from 'rxjs';
import { RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { LoginService, CompanyService, UserService } from '@core/service';
import { Client } from '@common/platform/api';
import 'numeral/locales/ru';
import 'moment/locale/ru';
import { ExtendedError } from '@ts-core/common/error';
import { Transport } from '@ts-core/common/transport';
import { ProfileQuizOpenCommand } from '@feature/profile-quiz/transport';
import { CompanyAddCommand } from '@feature/company/transport';

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
        private api: Client,
        private user: UserService,
        private company: CompanyService,
        private login: LoginService,
        private router: RouterService,
        protected renderer: Renderer2,
        protected settings: SettingsService,
        protected language: LanguageService,
        protected theme: ThemeService,
        protected transport: Transport,
        icon: MatIconRegistry,
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
        manager.addLoadable(this.language, this.login, this.api);

        merge(this.api.events)
            .pipe(
                filter(event => event.type === LoadableEvent.ERROR),
                map(<T>(event) => event.data as TransportHttpCommandAsync<T>),
                filter(command => command.isHandleError && !_.isNil(command.error)),
                takeUntil(this.destroyed)
            ).subscribe(data => this.apiLoadingError(data));

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loading.start();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loading.finish();
            }
        });

        // User
        this.user.logined.pipe(delay(0)).subscribe(() => {
            if (this.user.isUndefined) {
                this.transport.send(new ProfileQuizOpenCommand());
            }
            else if (this.user.isCompanyManager) {
                if (!this.company.hasCompany) {
                    this.transport.send(new CompanyAddCommand());
                }
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
        if (error.code === ExtendedError.HTTP_CODE_UNAUTHORIZED) {
            await this.windows.info(this.language.translate('error.unauthorized')).closePromise;
            this.login.logout();
        } else if (command.isHandleError) {
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

    protected readyHandler(): void { }
}
