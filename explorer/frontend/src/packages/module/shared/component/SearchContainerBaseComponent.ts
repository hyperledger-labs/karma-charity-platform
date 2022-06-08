import { Loadable, LoadableStatus } from '@ts-core/common';
import * as _ from 'lodash';
import { LedgerApiClient } from '@hlf-explorer/common/api';
import { RouterService } from '@core/service';
import { LedgerBlockTransaction, LedgerBlock, LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { Transport } from '@ts-core/common/transport';
import { BlockOpenCommand } from '@feature/block/transport';

export class SearchContainerBaseComponent extends Loadable {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public query: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected router: RouterService, protected transport: Transport, protected api: LedgerApiClient) {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    public async submit(): Promise<void> {
        if (this.isLoading) {
            return;
        }

        this.status = LoadableStatus.LOADING;
        try {
            let item = await this.api.search(this.query);  
            if (item instanceof LedgerBlock) {
                this.transport.send(new BlockOpenCommand(item));
            } else if (item instanceof LedgerBlockTransaction) {
                // this.router.transactionOpen(item);
            } else if (item instanceof LedgerBlockEvent) {
                // this.router.eventOpen(item);
            }
        } finally {
            this.status = LoadableStatus.NOT_LOADED;
        }
    }
}
