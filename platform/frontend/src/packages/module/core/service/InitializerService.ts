import { Injectable } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ThemeService } from '@ts-core/frontend/theme';
import { SettingsService } from './SettingsService';
import { Transport } from '@ts-core/common/transport';
import { ServiceWorkerService } from './ServiceWorkerService';

@Injectable({ providedIn: 'root' })
export class InitializerService extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        theme: ThemeService,
        transport: Transport,
        settings: SettingsService,
        serviceWorker: ServiceWorkerService,
    ) {
        super();
    }
}
