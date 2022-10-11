import { CdkTablePaginableMapCollection } from '@ts-core/angular';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { PaymentTransaction } from '@project/common/platform/payment';
import { IPagination } from '@ts-core/common';
import { Client } from '@project/common/platform/api';

@Injectable()
export class ProjectPaymentTransactionMapCollection extends CdkTablePaginableMapCollection<PaymentTransaction, PaymentTransaction> {

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public projectId: number;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: Client) {
        super(`id`);
        this.sort.createdDate = false;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isNeedClearAfterLoad(): boolean {
        return false;
    }

    protected async request(): Promise<IPagination<PaymentTransaction>> {
        return this.api.projectPaymentTransactionList(this.projectId, this.createRequestData());
    }

    protected parseItem(item: PaymentTransaction): PaymentTransaction {
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.projectId = null;
    }
}
