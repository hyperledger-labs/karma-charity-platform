import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NotificationService, WindowService } from '@ts-core/angular';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { takeUntil, filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(updates: SwUpdate, notifications: NotificationService, private windows: WindowService) {
        super();

        updates.versionUpdates.pipe(filter(event => event.type === 'VERSION_DETECTED'), takeUntil(this.destroyed)).subscribe(async () => {
            notifications.info('serviceWorker.update.newVersionDetectedNotification', null, null, { id: 'serviceWorkerUpdating' });
        });
        updates.versionUpdates.pipe(filter(event => event.type === 'VERSION_READY'), takeUntil(this.destroyed)).subscribe(async () => {
            notifications.close('serviceWorkerUpdating');
            await updates.activateUpdate();
            await windows.info('serviceWorker.update.newVersionNotification', null, null, { disableClose: true }).closePromise;
            this.reloadPage();
        });
        updates.unrecoverable.pipe(takeUntil(this.destroyed)).subscribe(async event => {
            await windows.info('serviceWorker.update.errorNotification', { error: event.reason }).closePromise;
            this.reloadPage();
        });
    }


    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private reloadPage(): void {
        document.location.reload();
    }
}
