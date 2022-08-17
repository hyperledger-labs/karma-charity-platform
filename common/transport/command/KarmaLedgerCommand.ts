import { TransportCommandAsync, TransportCommand } from '@ts-core/common';
import * as _ from 'lodash';

export enum KarmaLedgerCommand {
    USER_GET = 'KARMA:UserGet',
    USER_ADD = 'KARMA:UserAdd',
    USER_LIST = 'KARMA:UserList',
    USER_EDIT = 'KARMA:UserEdit',
    USER_REMOVE = 'KARMA:UserRemove',
    USER_COMPANY_LIST = 'KARMA:UserCompanyList',
    USER_PROJECT_LIST = 'KARMA:UserProjectList',
    USER_CRYPTO_KEY_CHANGE = 'KARMA:UserCryptoKeyChange',

    COMPANY_GET = 'KARMA:CompanyGet',
    COMPANY_ADD = 'KARMA:CompanyAdd',
    COMPANY_LIST = 'KARMA:CompanyList',
    COMPANY_EDIT = 'KARMA:CompanyEdit',
    COMPANY_REMOVE = 'KARMA:CompanyRemove',
    COMPANY_PROJECT_LIST = 'KARMA:CompanyProjectList',
    COMPANY_USER_ADD = 'KARMA:CompanyUserAdd',
    COMPANY_USER_LIST = 'KARMA:CompanyUserList',
    COMPANY_USER_EDIT = 'KARMA:CompanyUserEdit',
    COMPANY_USER_IS_IN = 'KARMA:CompanyUserIsIn',
    COMPANY_USER_REMOVE = 'KARMA:CompanyUserRemove',
    COMPANY_USER_ROLE_LIST = 'KARMA:CompanyUserRoleList',

    COIN_EMIT = 'KARMA:CoinEmit',
    COIN_BURN = 'KARMA:CoinBurn',
    COIN_TRANSFER = 'KARMA:CoinTransfer',

    PROJECT_GET = 'KARMA:ProjectGet',
    PROJECT_ADD = 'KARMA:ProjectAdd',
    PROJECT_LIST = 'KARMA:ProjectList',
    PROJECT_EDIT = 'KARMA:ProjectEdit',
    PROJECT_REMOVE = 'KARMA:ProjectRemove',
    PROJECT_USER_ADD = 'KARMA:ProjectUserAdd',
    PROJECT_USER_LIST = 'KARMA:ProjectUserList',
    PROJECT_USER_EDIT = 'KARMA:ProjectUserEdit',
    PROJECT_USER_IS_IN = 'KARMA:ProjectUserIsIn',
    PROJECT_USER_REMOVE = 'KARMA:ProjectUserRemove',
    PROJECT_USER_ROLE_LIST = 'KARMA:ProjectUserRoleList',

    GENESIS_GET = 'KARMA:GenesisGet'
}

export class KarmaTransportCommand<T> extends TransportCommand<T> {
    constructor(name: KarmaLedgerCommand, request?: T, id?: string, public isReadonly?: boolean) {
        super(name, request, id);
        this.isReadonly = isReadonly;
    }
}

export class KarmaTransportCommandAsync<U, V> extends TransportCommandAsync<U, V> {
    constructor(name: KarmaLedgerCommand, request?: U, id?: string, public isReadonly?: boolean) {
        super(name, request, id);
        this.isReadonly = isReadonly;
    }
}
