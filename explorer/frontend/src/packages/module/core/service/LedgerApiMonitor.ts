import { WindowService, NotificationService } from '@ts-core/angular';
import { LedgerApiSocket, LedgerSocketEvent } from '@hlf-explorer/common/api';
import * as _ from 'lodash';
import { ILogger } from '@ts-core/common/logger';
import { LoadableEvent } from '@ts-core/common';
import { filter, takeUntil } from 'rxjs/operators';
import { LedgerInfo } from '@hlf-explorer/common/ledger';

export class LedgerApiMonitor extends LedgerApiSocket {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(logger: ILogger, windows: WindowService, notifications: NotificationService) {
        super(logger);

        this.events
            .pipe(filter(event => event.type === LoadableEvent.COMPLETE))
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => notifications.remove(this.socketDisconnectNotificationId));

        this.events
            .pipe(filter(event => event.type === LoadableEvent.ERROR && !notifications.has(this.socketDisconnectNotificationId)))
            .pipe(takeUntil(this.destroyed))
            .subscribe(async event => {
                await notifications.question('error.socketDisconnected', { url: this.url }, null, { id: this.socketDisconnectNotificationId }).yesNotPromise;
                this.connect();
            });

        this.events
            .pipe(filter(event => event.type === LedgerSocketEvent.LEDGER_DEFAULT_NOT_FOUND))
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => {
                windows.info('error.noLedger', { name: this.settings.defaultLedgerName });
            });
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    //--------------------------------------------------------------------------

    protected ledgerListReceivedHandler(items: Array<LedgerInfo>): void {
        super.ledgerListReceivedHandler(items);
    }
    
    //--------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    //--------------------------------------------------------------------------

    
    private get socketDisconnectNotificationId(): string {
        return `socketDisconnect`;
    }
}
