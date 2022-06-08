import * as _ from 'lodash';

export class ILedgerAction {
    uid: string;
    date: Date;
    type: LedgerActionType;
    objectUid?: string;
    transactionUid: string;

    isSucceed: boolean;
    initiatorUid?: string;
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

    // From user
    COIN_DONATED = 'COIN_DONATED',
    COIN_REDEEMED = 'COIN_REDEEMED',

    // From company and project
    COIN_SENT = 'COIN_SENT',
    COIN_RECEIVED = 'COIN_RECEIVED',

    COIN_BURNED = 'COIN_BURNED',
    COIN_EMITTED = 'COIN_EMITTED',
    COIN_TRANSFERED = 'COIN_TRANSFERED',

    PROJECT_ADDED = 'PROJECT_ADDED',
    PROJECT_EDITED = 'PROJECT_EDITED',
    PROJECT_REMOVED = 'PROJECT_REMOVED',
    PROJECT_USER_ADDED = 'PROJECT_USER_ADDED',
    PROJECT_USER_EDITED = 'PROJECT_USER_EDITED',
    PROJECT_USER_REMOVED = 'PROJECT_USER_REMOVED'
}
