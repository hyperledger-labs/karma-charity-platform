import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import * as _ from 'lodash';
import { ObjectUtil } from '@ts-core/common/util';
import { LedgerBlockTransactionWrapper } from './LedgerBlockTransactionWrapper';

export class LedgerBlockEventWrapper extends LedgerBlockEvent {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(item: LedgerBlockEvent) {
        super();
        ObjectUtil.copyProperties(item, this);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get isHasData(): boolean {
        return !_.isEmpty(this.data);
    }

    public get isValid(): boolean {
        return this.transactionValidationCode === 0;
    }

    public get isExecuted(): boolean {
        return this.isValid;
    }

    public get eventData(): any {
        return this.isHasData ? LedgerBlockTransactionWrapper.parseJSON(this.data) : null;
    }
}
