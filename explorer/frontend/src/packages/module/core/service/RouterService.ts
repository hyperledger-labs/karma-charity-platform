import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LedgerBlock, LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { RouterBaseService } from '@ts-core/angular';
import { NativeWindowService } from '@ts-core/frontend/service';
import * as _ from 'lodash';
import { IBlockOpenDto } from '@feature/block/transport';
import { ITransactionOpenDto } from '@feature/transaction/transport';

@Injectable({ providedIn: 'root' })
export class RouterService extends RouterBaseService {
    //--------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    //--------------------------------------------------------------------------

    public static MAIN_URL = '';

    public static BLOCK_URL = 'block';
    public static BLOCKS_URL = 'blocks';

    public static TRANSACTION_URL = 'transaction';
    public static TRANSACTIONS_URL = 'transactions';

    public static EVENT_URL = 'event';
    public static EVENTS_URL = 'events';

    public static ERROR_URL = 'error';
    public static MESSAGE_URL = 'message';

    public static DEFAULT_URL;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(router: Router, nativeWindow: NativeWindowService) {
        super(router, nativeWindow);
        RouterService.DEFAULT_URL = RouterService.MAIN_URL;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public blockOpen(item: IBlockOpenDto): void {
        if (item instanceof LedgerBlock) {
            item = item.number;
        }
        this.navigate(`${RouterService.BLOCK_URL}/${item}`);
    }

    public blocksOpen(): void {
        this.navigate(`${RouterService.BLOCKS_URL}`);
    }

    public eventOpen(item: LedgerBlockEvent | string): void {
        let value = _.isString(item) ? item : item.uid;
        this.navigate(`${RouterService.EVENT_URL}/${value}`);
    }

    public eventsOpen(): void {
        this.navigate(`${RouterService.EVENTS_URL}`);
    }

    public transactionOpen(item: ITransactionOpenDto): void {
        let value = _.isString(item) ? item : item.hash;
        this.navigate(`${RouterService.TRANSACTION_URL}/${value}`);
    }

    public transactionsOpen(): void {
        this.navigate(`${RouterService.TRANSACTIONS_URL}`);
    }

    public getFragment(snapshot: ActivatedRoute | ActivatedRouteSnapshot, defaultValue?: string): string {
        if (snapshot instanceof ActivatedRoute) {
            snapshot = snapshot.snapshot;
        }
        return !_.isNil(snapshot.fragment) ? snapshot.fragment : defaultValue;
    }
    public async setFragment(value: string): Promise<boolean> {
        return this.applyExtras({ fragment: value });
    }
}
