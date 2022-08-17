import { TransportHttp } from '@ts-core/common';
import { ILogger } from '@ts-core/common';
import * as _ from 'lodash';
import { IStatusDtoResponse } from './IStatusDtoResponse';
import { LedgerUser } from '../ledger/user';
import { TransformUtil } from '@ts-core/common';
import { Paginable, IPagination, UID, getUid } from '@ts-core/common';
import { ILedgerAction, ILedgerTransaction } from './action';
import { LedgerCompany } from '../ledger/company';
import { LedgerProject } from '../ledger/project';
import { IResetDto } from './IResetDto';
import { ILedgerActionFinance } from './action/finance';

export class ApiClient extends TransportHttp {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, url?: string) {
        super(logger, { method: 'get', baseURL: url, isHandleError: true, isHandleLoading: true, headers: {} });
    }

    // --------------------------------------------------------------------------
    //
    //  Api Methods
    //
    // --------------------------------------------------------------------------

    public async getStatus(): Promise<IStatusDtoResponse> {
        return this.call<IStatusDtoResponse>(STATUS_URL);
    }

    public async getUser(uid: UID): Promise<LedgerUser> {
        let item = await this.call<LedgerUser>(USER_URL, { data: { uid: getUid(uid) } });
        return TransformUtil.toClass(LedgerUser, item);
    }

    public async getUserList(data?: Paginable<ILedgerAction>): Promise<IPagination<LedgerUser>> {
        let items = await this.call<IPagination<LedgerUser>>(USER_LIST_URL, { data });
        items.items = TransformUtil.toClassMany(LedgerUser, items.items);
        return items;
    }

    public async getCompany(uid: UID): Promise<LedgerCompany> {
        let item = await this.call<LedgerCompany>(COMPANY_URL, { data: { uid: getUid(uid) } });
        return TransformUtil.toClass(LedgerCompany, item);
    }

    public async getCompanyList(data?: Paginable<ILedgerAction>): Promise<IPagination<LedgerCompany>> {
        let items = await this.call<IPagination<LedgerCompany>>(COMPANY_LIST_URL, { data });
        items.items = TransformUtil.toClassMany(LedgerCompany, items.items);
        return items;
    }

    public async getProject(uid: UID): Promise<LedgerProject> {
        let item = await this.call<LedgerProject>(PROJECT_URL, { data: { uid: getUid(uid) } });
        return TransformUtil.toClass(LedgerProject, item);
    }

    public async getProjectList(data?: Paginable<ILedgerAction>): Promise<IPagination<LedgerProject>> {
        let items = await this.call<IPagination<LedgerProject>>(PROJECT_LIST_URL, { data });
        items.items = TransformUtil.toClassMany(LedgerProject, items.items);
        return items;
    }

    public async getTransaction(uid: string): Promise<ILedgerTransaction> {
        let item = await this.call<ILedgerTransaction>(TRANSACTION_URL, { data: { uid: getUid(uid) } });
        return TransformUtil.toClass(ILedgerTransaction, item);
    }

    public async getActionList(data?: Paginable<ILedgerAction>): Promise<IPagination<ILedgerAction>> {
        let items = await this.call<IPagination<ILedgerAction>>(ACTION_LIST_URL, { data });
        return items;
    }

    public async getActionFinanceList(data?: Paginable<ILedgerActionFinance>): Promise<IPagination<ILedgerActionFinance>> {
        if (_.isNil(data)) {
            data = {} as any;
        }
        let items = await this.call<IPagination<ILedgerActionFinance>>(ACTION_FINANCE_LIST_URL, { data });
        return items;
    }

    public async reset(password: string): Promise<void> {
        await this.call<IResetDto>(RESET_URL, { data: { password }, method: 'post' });
    }
}

export const PREFIX_URL = 'api/';

export const USER_URL = PREFIX_URL + 'user';
export const USER_LIST_URL = PREFIX_URL + 'users';
export const COMPANY_URL = PREFIX_URL + 'company';
export const COMPANY_LIST_URL = PREFIX_URL + 'companies';
export const PROJECT_URL = PREFIX_URL + 'project';
export const PROJECT_LIST_URL = PREFIX_URL + 'projects';

export const RESET_URL = PREFIX_URL + 'reset';
export const STATUS_URL = PREFIX_URL + 'status';

export const TRANSACTION_URL = PREFIX_URL + 'transaction';

export const ACTION_LIST_URL = PREFIX_URL + 'actions';
export const ACTION_FINANCE_LIST_URL = ACTION_LIST_URL + '/finance';
