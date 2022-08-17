import * as _ from 'lodash';
import { ILedgerActionFinance } from './finance';

export class ILedgerAction {
    uid: string;
    date: Date;
    type: LedgerActionType;
    objectUid?: string;
    transactionUid: string;

    isSucceed: boolean;
    initiatorUid?: string;
    
    finance?: ILedgerActionFinance;
}

export enum LedgerActionType {
    USER_ADDED = 'USER_ADDED',
    USER_EDITED = 'USER_EDITED',
    USER_REMOVED = 'USER_REMOVED',
    USER_CRYPTO_KEY_CHANGED = 'USER_CRYPTO_KEY_CHANGED',

    COMPANY_ADDED = 'COMPANY_ADDED',
    COMPANY_EDITED = 'COMPANY_EDITED',
    COMPANY_REMOVED = 'COMPANY_REMOVED',
    COMPANY_USER_ADDED = 'COMPANY_USER_ADDED',
    COMPANY_USER_EDITED = 'COMPANY_USER_EDITED',
    COMPANY_USER_REMOVED = 'COMPANY_USER_REMOVED',

    // General coin actions
    COIN_BURNED = 'COIN_BURNED',
    COIN_EMITTED = 'COIN_EMITTED',
    COIN_REDEEMED = 'COIN_REDEEMED',
    COIN_TRANSFERED = 'COIN_TRANSFERED',

    // Based on COIN_EMIT and details internal details (CoinEmitType)
    COIN_DONATE_SENT = 'COIN_DONATE_SENT',
    COIN_DONATE_RECEIVED = 'COIN_DONATE_RECEIVED',
    COIN_FEE_AGGREGATOR_SENT = 'COIN_FEE_AGGREGATOR_SENT',
    COIN_FEE_AGGREGATOR_RECEIVED = 'COIN_FEE_AGGREGATOR_RECEIVED',

    // Base on COIN_TRANSFERED
    COIN_SENT = 'COIN_SENT',
    COIN_RECEIVED = 'COIN_RECEIVED',

    PROJECT_ADDED = 'PROJECT_ADDED',
    PROJECT_EDITED = 'PROJECT_EDITED',
    PROJECT_REMOVED = 'PROJECT_REMOVED',
    PROJECT_USER_ADDED = 'PROJECT_USER_ADDED',
    PROJECT_USER_EDITED = 'PROJECT_USER_EDITED',
    PROJECT_USER_REMOVED = 'PROJECT_USER_REMOVED'
}
