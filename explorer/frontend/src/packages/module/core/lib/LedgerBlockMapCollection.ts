import { PaginableDataSourceMapCollection } from '@ts-core/common/map/dataSource';
import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { IPagination } from '@ts-core/common/dto';
import { LedgerApiClient } from '@hlf-explorer/common/api';

export class LedgerBlockMapCollection extends PaginableDataSourceMapCollection<LedgerBlock, LedgerBlock> {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private api: LedgerApiClient) {
        super('uid');
        this.sort.number = false;
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

    protected request(): Promise<IPagination<LedgerBlock>> {
        return this.api.getBlockList(this.createRequestData());
    }

    protected parseItem(item: LedgerBlock): LedgerBlock {
        return item;
    }
}
