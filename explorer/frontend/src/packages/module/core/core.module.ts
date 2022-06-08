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
    WindowService,
    NotificationService
} from '@ts-core/angular';
import { SettingsBaseService } from '@ts-core/frontend/service';
import { InitializerService, LedgerService, RouterService, SettingsService } from './service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ILogger, Logger, LoggerLevel } from '@ts-core/common/logger';
import { Transport } from '@ts-core/common/transport';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TRANSPORT_LAZY_MODULES } from './core.lazy.modules';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DateUtil } from '@ts-core/common/util';
import { LedgerApiClient } from '@hlf-explorer/common/api';
import { LedgerApiMonitor } from './service/LedgerApiMonitor';

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

    MatBottomSheetModule,

    VIComponentModule,
];

//--------------------------------------------------------------------------
//
// 	Factories
//
//--------------------------------------------------------------------------

function initializerFactory(settings: SettingsService): () => Promise<void> {
    return () => settings.load();
}

function clientFactory(logger: ILogger, settings: SettingsService): LedgerApiClient {
    let item = new LedgerApiClient(logger, settings.apiUrl, settings.ledgerName);
    /*
    item.url = settings.apiUrl;
    item.settings.isHandleError = true;
    item.settings.defaultLedgerName = settings.ledgerName;
    item.level = LoggerLevel.NONE;
    */
    return item;
}

function monitorClientFactory(logger: ILogger, settings: SettingsService, windows: WindowService, notifications: NotificationService): LedgerApiMonitor {
    let item = new LedgerApiMonitor(logger, windows, notifications);
    item.url = settings.apiUrl;
    item.settings.defaultLedgerName = settings.ledgerName;
    // item.level = LoggerLevel.NONE;
    return item;
}

function transportFactory(logger: ILogger, loader: LazyModuleLoader<ITransportLazyModuleData>): Transport {
    let item = new TransportLazy(logger, loader);
    loader.modules.addItems(TRANSPORT_LAZY_MODULES);
    return item;
}

class HammerConfig extends HammerGestureConfig {
    overrides = <any>{
        swipe: { direction: Hammer.DIRECTION_ALL }
    };
}

//--------------------------------------------------------------------------
//
// 	Module
//
//--------------------------------------------------------------------------

@NgModule({
    imports: [
        ...modules,
        VICommonModule.forRoot({ languageOptions: { name: 'hlf-explorer-language' }, themeOptions: { name: 'hlf-explorer-theme' } }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: true, registrationStrategy: 'registerWhenStable:30000' })
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            deps: [SettingsService, InitializerService],
            useFactory: initializerFactory,
            multi: true
        },

        LedgerService,

        { provide: Transport, deps: [Logger, LazyModuleLoader], useFactory: transportFactory },
        { provide: LedgerApiClient, deps: [Logger, SettingsService], useFactory: clientFactory },
        { provide: LedgerApiMonitor, deps: [Logger, SettingsService, WindowService, NotificationService], useFactory: monitorClientFactory },

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
