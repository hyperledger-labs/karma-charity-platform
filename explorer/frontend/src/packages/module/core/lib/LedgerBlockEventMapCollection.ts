import { PaginableDataSourceMapCollection } from '@ts-core/common/map/dataSource';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { IPagination } from '@ts-core/common/dto';
import { LedgerApiClient } from '@hlf-explorer/common/api';

export class LedgerBlockEventMapCollection extends PaginableDataSourceMapCollection<LedgerBlockEvent, LedgerBlockEvent> {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private api: LedgerApiClient) {
        super('uid');
        this.sort.createdDate = false;
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected isNeedClearAfterLoad():boolean {
        return true;
    }
    
    protected commitPageIndexProperties(): void {
        this.load();
    }

    protected request(): Promise<IPagination<LedgerBlockEvent>> {
        return this.api.getEventList(this.createRequestData());
    }

    protected parseItem(item: LedgerBlockEvent): LedgerBlockEvent {
        return item;
    }
}
