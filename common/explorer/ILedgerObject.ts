import * as Ledger from '../ledger';
import { IUIDable } from '@ts-core/common';

export interface ILedgerObject<T extends Ledger.ILedgerObject> extends IUIDable {
    uid: string;
    createdDate: Date;
    description?: string;
    data: T;
}
