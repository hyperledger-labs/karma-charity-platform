//--------------------------------------------------------------------------
//
// 	Imports
//
//--------------------------------------------------------------------------

import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import * as Hammer from 'hammerjs';
import {
    RouterBaseService,
    VICommonModule,
    VIComponentModule,
    ITransportLazyModuleData,
    TransportLazy,
    LazyModuleLoader,
    PipeBaseService,
    LoginBaseService,
    UserBaseService
} from '@ts-core/angular';
import { SettingsBaseService } from '@ts-core/frontend';
import { InitializerService, RouterService, SettingsService, PipeService, LoginService, UserService } from '@core/service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ILogger, Logger, LoggerLevel } from '@ts-core/common';
import { Transport } from '@ts-core/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TRANSPORT_LAZY_MODULES } from './core.lazy.modules';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateUtil } from '@ts-core/common';
import { Client } from '@common/platform/api';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

//--------------------------------------------------------------------------
//
// 	Modules
//
//--------------------------------------------------------------------------

const modules = [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HammerModule,
    RouterModule,

    VIComponentModule,

    // Have to import it here, even if it's not using in core
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
];

//--------------------------------------------------------------------------
//
// 	Factories
//
//--------------------------------------------------------------------------

function initializerFactory(settings: SettingsService, router: RouterBaseService, api: Client): () => Promise<void> {
    return async () => {
        await settings.load('config.json', router.getParams());
        api.url = settings.apiUrl;
    }
}

function transportFactory(logger: ILogger, loader: LazyModuleLoader<ITransportLazyModuleData>): Transport {
    let item = new TransportLazy(logger, loader, { defaultTimeout: DateUtil.MILISECONDS_DAY });
    loader.modules.addItems(TRANSPORT_LAZY_MODULES);
    return item;
}

function clientFactory(logger: ILogger): Client {
    let item = new Client(logger);
    item.level = LoggerLevel.NONE;
    return item;
}

class HammerConfig extends HammerGestureConfig {
    overrides = <any>{ swipe: { direction: Hammer.DIRECTION_ALL } };
}

//--------------------------------------------------------------------------
//
// 	Module
//
//--------------------------------------------------------------------------

@NgModule({
    imports: [
        ...modules,
        VICommonModule.forRoot({ languageOptions: { name: 'platform-site-language' }, themeOptions: { name: 'platform-site-theme' } }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: true, registrationStrategy: 'registerWhenStable:30000' })
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            deps: [SettingsService, RouterBaseService, Client, InitializerService],
            useFactory: initializerFactory,
            multi: true
        },

        { provide: Client, deps: [Logger, SettingsService], useFactory: clientFactory },
        { provide: Transport, deps: [Logger, LazyModuleLoader], useFactory: transportFactory },

        { provide: PipeBaseService, useExisting: PipeService, },
        { provide: UserBaseService, useExisting: UserService },
        { provide: LoginBaseService, useExisting: LoginService },
        { provide: RouterBaseService, useExisting: RouterService },
        { provide: SettingsBaseService, useExisting: SettingsService },

        { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { float: 'always' } },
        {
            provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
            useValue: {
                showDelay: 500,
                hideDelay: 0,
                touchGestures: 'on',
                touchendHideDelay: 2 * DateUtil.MILLISECONDS_SECOND,
            }
        },
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: { dateInput: 'LLL' },
                display: {
                    dateInput: 'LL',
                    dateA11yLabel: 'LL',
                    monthYearLabel: 'MMM YYYY',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        }
    ]
})
export class CoreModule { }
