import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { WindowService } from '@ts-core/angular';
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

    constructor(updates: SwUpdate, windows: WindowService) {
        super();

        updates.versionUpdates.pipe(filter(event => event.type === 'VERSION_READY'), takeUntil(this.destroyed)).subscribe(async event => {
            await windows.question('serviceWorker.update.newVersionConfirmation').yesNotPromise;
            await updates.activateUpdate();
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
