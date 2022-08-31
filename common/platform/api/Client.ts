import { TransportHttp, ITransportHttpSettings, UID, getUid } from '@ts-core/common';
import { ILogger } from '@ts-core/common';
import * as _ from 'lodash';
import { ITraceable, TraceUtil } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { IInitDto, IInitDtoResponse, ILoginDto, ILoginDtoResponse } from './login';
import { User, UserCompany, UserProject } from '../user';
import { IUserListDto, IUserListDtoResponse, IUserFindDtoResponse, IUserGetDtoResponse, IUserEditDto, IUserEditDtoResponse, IUserTypeDto, IUserTypeDtoResponse } from '../api/user';
import { IGeo } from '../geo';
import { File } from '../file';
import { IFileBase64UploadDto, IFileListDto, IFileListDtoResponse, IFileRemoveDtoResponse, IFileUploadDtoResponse } from './file'
import { IPaymentAggregatorGetDto, IPaymentAggregatorGetDtoResponse, IPaymentGetDtoResponse, IPaymentListDto, IPaymentListDtoResponse, IPaymentPublicListDto, IPaymentPublicListDtoResponse, IPaymentTransactionListDto, IPaymentTransactionListDtoResponse } from './payment';
import { INalogSearchDtoResponse, INalogObject } from './nalog';
import { ICompanyAddDto, ICompanyActivateDtoResponse, ICompanyAddDtoResponse, ICompanyListDto, ICompanyListDtoResponse, ICompanyRejectDtoResponse, ICompanyToVerifyDtoResponse, ICompanyVerifyDtoResponse, ICompanyGetDtoResponse, ICompanyUserListDtoResponse, ICompanyUserListDto, ICompanyUserRoleGetDtoResponse, ICompanyUserRoleSetDtoResponse, ICompanyUserRoleSetDto, ICompanyEditDtoResponse, ICompanyEditDto, ICompanyPublicListDtoResponse, ICompanyPublicListDto } from './company';
import { IProjectAddDto, IProjectActivateDtoResponse, IProjectAddDtoResponse, IProjectListDto, IProjectListDtoResponse, IProjectRejectDtoResponse, IProjectToVerifyDtoResponse, IProjectVerifyDtoResponse, IProjectGetDtoResponse, IProjectUserListDtoResponse, IProjectUserListDto, IProjectUserRoleGetDtoResponse, IProjectUserRoleSetDtoResponse, IProjectUserRoleSetDto, IProjectReportSubmitDtoResponse, IProjectEditDtoResponse, IProjectEditDto, IProjectPublicListDto, IProjectPublicListDtoResponse } from './project';
import { Company, CompanyUser } from '../company';
import { Project, ProjectUser } from '../project';
import { LedgerCompanyRole, LedgerProjectRole } from '../../ledger/role';
import { Payment, PaymentTransaction } from '../payment';
import { PaymentTarget } from '../payment';
import { ILedgerObjectDetails } from './ILedgerObjectDetails';

export class Client extends TransportHttp<ITransportHttpSettings> {
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
    //  Auth Methods
    //
    // --------------------------------------------------------------------------

    public async login(data: ILoginDto): Promise<ILoginDtoResponse> {
        return this.call<ILoginDtoResponse, ILoginDto>(LOGIN_URL, { data: TraceUtil.addIfNeed(data), method: 'post' });
    }

    public async init(data?: IInitDto): Promise<IInitDtoResponse> {
        let item = await this.call<IInitDtoResponse, IInitDto>(INIT_URL, { data: TraceUtil.addIfNeed(data) });
        item.user = TransformUtil.toClass(User, item.user);
        item.company = TransformUtil.toClass(UserCompany, item.company);
        return item;
    }

    public async logout(traceId?: string): Promise<void> {
        return this.call<void, ITraceable>(LOGOUT_URL, { data: TraceUtil.addIfNeed({ traceId }), method: 'post' });
    }

    // --------------------------------------------------------------------------
    //
    //  Other Methods
    //
    // --------------------------------------------------------------------------

    public async geo(): Promise<IGeo> {
        return this.call<IGeo, void>(GEO_URL, { isHandleError: false });
    }

    public async nalogSearch(value: string | number): Promise<INalogSearchDtoResponse> {
        let item = await this.call<INalogSearchDtoResponse>(`${NALOG_SERACH_URL}/${value}`);
        return TransformUtil.toClassMany(INalogObject, item);
    }

    // --------------------------------------------------------------------------
    //
    //  Payment Methods
    //
    // --------------------------------------------------------------------------

    public async paymentAggregatorGet(data: IPaymentAggregatorGetDto): Promise<IPaymentAggregatorGetDtoResponse> {
        let item = await this.call<IPaymentAggregatorGetDtoResponse, IPaymentAggregatorGetDto>(PAYMENT_AGGREGATOR_URL, { data });
        item.target = TransformUtil.toClass(PaymentTarget, item.target);
        return item;
    }

    public async paymentGet(id: number): Promise<IPaymentGetDtoResponse> {
        let item = await this.call<Payment>(`${PAYMENT_URL}/${id}`);
        return TransformUtil.toClass(Payment, item);
    }

    public async paymentGetByReference(referenceId: string): Promise<IPaymentGetDtoResponse> {
        let item = await this.call<Payment>(`${PAYMENT_REFERENCE_URL}/${referenceId}`, { isHandleError: false });
        return TransformUtil.toClass(Payment, item);
    }

    public async paymentList(data?: IPaymentListDto): Promise<IPaymentListDtoResponse> {
        let item = await this.call<IPaymentListDtoResponse, IPaymentListDto>(PAYMENT_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(Payment, item.items);
        return item;
    }

    public async paymentTransactionList(data?: IPaymentTransactionListDto): Promise<IPaymentTransactionListDtoResponse> {
        let item = await this.call<IPaymentTransactionListDtoResponse, IPaymentTransactionListDto>(PAYMENT_TRANSACTION_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(PaymentTransaction, item.items);
        return item;
    }

    public async paymentListPublic(data?: IPaymentPublicListDto): Promise<IPaymentPublicListDtoResponse> {
        let item = await this.call<IPaymentPublicListDtoResponse, IPaymentPublicListDto>(PAYMENT_PUBLIC_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(Payment, item.items);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  User Methods
    //
    // --------------------------------------------------------------------------

    public async userGet(id: number): Promise<IUserGetDtoResponse> {
        let item = await this.call<User>(`${USER_URL}/${id}`);
        return TransformUtil.toClass(User, item);
    }

    public async userFind(uid: string): Promise<IUserFindDtoResponse> {
        let item = await this.call<User>(`${USER_FIND_URL}/${uid}`);
        return TransformUtil.toClass(User, item);
    }

    public async userEdit(data: IUserEditDto): Promise<IUserEditDtoResponse> {
        let item = await this.call<IUserEditDtoResponse, IUserEditDto>(`${USER_URL}/${data.id}`, { method: 'put', data });
        return TransformUtil.toClass(User, item);
    }

    public async userType(data: IUserTypeDto): Promise<IUserTypeDtoResponse> {
        let item = await this.call<IUserTypeDtoResponse, IUserTypeDto>(USER_TYPE_URL, { method: 'put', data });
        return TransformUtil.toClass(User, item);
    }

    public async userList(data?: IUserListDto): Promise<IUserListDtoResponse> {
        let item = await this.call<IUserListDtoResponse, IUserListDto>(USER_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(User, item.items);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Company Methods
    //
    // --------------------------------------------------------------------------

    public async companyAdd(data: ICompanyAddDto): Promise<ICompanyAddDtoResponse> {
        let item = await this.call<ICompanyAddDtoResponse, ICompanyAddDto>(COMPANY_URL, { method: 'post', data });
        return TransformUtil.toClass(UserCompany, item);
    }

    public async companyVerify(id: number): Promise<ICompanyVerifyDtoResponse> {
        let item = await this.call<ICompanyToVerifyDtoResponse, void>(`${COMPANY_URL}/${id}/verify`, { method: 'post' });
        return TransformUtil.toClass(Company, item);
    }

    public async companyReject(id: number): Promise<ICompanyRejectDtoResponse> {
        let item = await this.call<ICompanyToVerifyDtoResponse, void>(`${COMPANY_URL}/${id}/reject`, { method: 'post' });
        return TransformUtil.toClass(Company, item);
    }

    public async companyToVerify(): Promise<ICompanyToVerifyDtoResponse> {
        let item = await this.call<ICompanyToVerifyDtoResponse, void>(COMPANY_TO_VERIFY_URL, { method: 'post' });
        return TransformUtil.toClass(UserCompany, item);
    }

    public async companyActivate(): Promise<ICompanyActivateDtoResponse> {
        let item = await this.call<ICompanyActivateDtoResponse, void>(COMPANY_ACTIVATE_URL, { method: 'post' });
        return TransformUtil.toClass(UserCompany, item);
    }

    public async companyGet(id: number): Promise<ICompanyGetDtoResponse> {
        let item = await this.call<UserCompany>(`${COMPANY_URL}/${id}`);
        return TransformUtil.toClass(UserCompany, item);
    }

    public async companyEdit(data: ICompanyEditDto): Promise<ICompanyEditDtoResponse> {
        let item = await this.call<ICompanyEditDtoResponse, ICompanyEditDto>(`${COMPANY_URL}/${data.id}`, { method: 'put', data });
        return TransformUtil.toClass(UserCompany, item);
    }

    public async companyList(data?: ICompanyListDto): Promise<ICompanyListDtoResponse> {
        let item = await this.call<ICompanyListDtoResponse, ICompanyListDto>(COMPANY_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(UserCompany, item.items);
        return item;
    }

    public async companyUserList(data?: ICompanyUserListDto, id?: number): Promise<ICompanyUserListDtoResponse> {
        let item = await this.call<ICompanyUserListDtoResponse, ICompanyUserListDto>(`${COMPANY_URL}/${id}/user`, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(CompanyUser, item.items);
        return item;
    }

    public async companyUserRoleGet(companyId: number, userId: number): Promise<ICompanyUserRoleGetDtoResponse> {
        let item = await this.call<ICompanyUserRoleGetDtoResponse, void>(`${COMPANY_URL}/${companyId}/role/${userId}`);
        return item;
    }

    public async companyUserRoleSet(companyId: number, userId: number, data: Array<LedgerCompanyRole>): Promise<ICompanyUserRoleSetDtoResponse> {
        let item = await this.call<ICompanyUserRoleSetDtoResponse, ICompanyUserRoleSetDto>(`${COMPANY_URL}/${companyId}/role/${userId}`, { data, method: 'post' });
        return item;
    }

    public async companyListPublic(data?: ICompanyPublicListDto): Promise<ICompanyPublicListDtoResponse> {
        let item = await this.call<ICompanyPublicListDtoResponse, ICompanyPublicListDto>(COMPANY_PUBLIC_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(Company, item.items);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Project Methods
    //
    // --------------------------------------------------------------------------

    public async projectAdd(data: IProjectAddDto): Promise<IProjectAddDtoResponse> {
        let item = await this.call<IProjectAddDtoResponse, IProjectAddDto>(PROJECT_URL, { method: 'post', data });
        return TransformUtil.toClass(UserProject, item);
    }

    public async projectVerify(id: number): Promise<IProjectVerifyDtoResponse> {
        let item = await this.call<IProjectToVerifyDtoResponse, void>(`${PROJECT_URL}/${id}/verify`, { method: 'post' });
        return TransformUtil.toClass(Project, item);
    }

    public async projectEdit(data: IProjectEditDto): Promise<IProjectEditDtoResponse> {
        let item = await this.call<IProjectEditDtoResponse, IProjectEditDto>(`${PROJECT_URL}/${data.id}`, { method: 'put', data });
        return TransformUtil.toClass(UserProject, item);
    }

    public async projectReject(id: number): Promise<IProjectRejectDtoResponse> {
        let item = await this.call<IProjectToVerifyDtoResponse, void>(`${PROJECT_URL}/${id}/reject`, { method: 'post' });
        return TransformUtil.toClass(Project, item);
    }

    public async projectToVerify(id: number): Promise<IProjectToVerifyDtoResponse> {
        let item = await this.call<IProjectToVerifyDtoResponse, void>(`${PROJECT_URL}/${id}/toVerify`, { method: 'post' });
        return TransformUtil.toClass(UserProject, item);
    }

    public async projectActivate(id: number): Promise<IProjectActivateDtoResponse> {
        let item = await this.call<IProjectActivateDtoResponse, void>(`${PROJECT_URL}/${id}/activate`, { method: 'post' });
        return TransformUtil.toClass(UserProject, item);
    }

    public async projectReportSubmit(id: number): Promise<IProjectReportSubmitDtoResponse> {
        let item = await this.call<IProjectActivateDtoResponse, void>(`${PROJECT_URL}/${id}/reportSubmit`, { method: 'post' });
        return TransformUtil.toClass(UserProject, item);
    }

    public async projectGet(id: number): Promise<IProjectGetDtoResponse> {
        let item = await this.call<UserProject>(`${PROJECT_URL}/${id}`);
        return TransformUtil.toClass(UserProject, item);
    }

    public async projectList(data?: IProjectListDto): Promise<IProjectListDtoResponse> {
        let item = await this.call<IProjectListDtoResponse, IProjectListDto>(PROJECT_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(UserProject, item.items);
        return item;
    }

    public async projectUserList(data?: IProjectUserListDto, id?: number): Promise<IProjectUserListDtoResponse> {
        let item = await this.call<IProjectUserListDtoResponse, IProjectUserListDto>(`${PROJECT_URL}/${id}/user`, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(ProjectUser, item.items);
        return item;
    }

    public async projectPaymentTransactionList(id: number, data?: IPaymentTransactionListDto): Promise<IPaymentTransactionListDtoResponse> {
        let item = await this.call<IPaymentTransactionListDtoResponse, IPaymentTransactionListDto>(`${PROJECT_URL}/${id}/paymentTransaction`, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(PaymentTransaction, item.items);
        return item;
    }

    public async projectUserRoleGet(projectId: number, userId: number): Promise<IProjectUserRoleGetDtoResponse> {
        let item = await this.call<IProjectUserRoleGetDtoResponse, void>(`${PROJECT_URL}/${projectId}/role/${userId}`);
        return item;
    }

    public async projectUserRoleSet(projectId: number, userId: number, data: Array<LedgerProjectRole>): Promise<IProjectUserRoleSetDtoResponse> {
        let item = await this.call<IProjectUserRoleSetDtoResponse, IProjectUserRoleSetDto>(`${PROJECT_URL}/${projectId}/role/${userId}`, { data, method: 'post' });
        return item;
    }

    public async projectListPublic(data?: IProjectPublicListDto): Promise<IProjectPublicListDtoResponse> {
        let item = await this.call<IProjectPublicListDtoResponse, IProjectPublicListDto>(PROJECT_PUBLIC_URL, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(Project, item.items);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  File Methods
    //
    // --------------------------------------------------------------------------

    public async fileBase64Upload(data: IFileBase64UploadDto): Promise<IFileUploadDtoResponse> {
        let item = await this.call<IFileUploadDtoResponse, IFileBase64UploadDto>(`${FILE_BASE64_URL}`, { data: TraceUtil.addIfNeed(data), method: 'post' });
        item = TransformUtil.toClass(File, item);
        return item;
    }

    public async fileList(data?: IFileListDto): Promise<IFileListDtoResponse> {
        let item = await this.call<IFileListDtoResponse, IFileListDto>(`${FILE_URL}`, { data: TraceUtil.addIfNeed(data) });
        item.items = TransformUtil.toClassMany(File, item.items);
        return item;
    }

    public async fileRemove(id: number): Promise<IFileRemoveDtoResponse> {
        let item = await this.call<IFileRemoveDtoResponse, number>(`${FILE_URL}/${id}`, { method: 'delete' });
        return TransformUtil.toClass(File, item);
    }

    //--------------------------------------------------------------------------
    //
    // 	Ledger Object
    //
    //--------------------------------------------------------------------------

    public async ledgerObjectDetails(uid: UID): Promise<ILedgerObjectDetails> {
        return this.call<ILedgerObjectDetails>(LEDGER_OBJECT_DETAILS_URL, { data: { uid: getUid(uid) } });
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public set sid(value: string) {
        if (!_.isNil(this.headers)) {
            this.headers.Authorization = `Bearer ${value}`;
        }
    }
}

const PREFIX = 'api/';

export const GEO_URL = PREFIX + 'geo';
export const USER_URL = PREFIX + 'user';
export const USER_FIND_URL = PREFIX + 'userFind';
export const USER_TYPE_URL = PREFIX + 'userType';

export const COMPANY_URL = PREFIX + 'company';
export const COMPANY_PUBLIC_URL = PREFIX + 'companyPublic';
export const COMPANY_ACTIVATE_URL = COMPANY_URL + '/activate';
export const COMPANY_TO_VERIFY_URL = COMPANY_URL + '/toVerify';

export const FILE_URL = PREFIX + 'file';
export const FILE_BASE64_URL = PREFIX + 'fileBase64';
export const FILE_TEMPORARY_IMAGE_URL = PREFIX + 'fileImageTemporary';
export const PROJECT_URL = PREFIX + 'project';
export const PROJECT_PUBLIC_URL = PREFIX + 'projectPublic';

export const INIT_URL = PREFIX + 'init';
export const LOGIN_URL = PREFIX + 'login';
export const LOGOUT_URL = PREFIX + 'logout';

export const PAYMENT_URL = PREFIX + 'payment';
export const PAYMENT_PUBLIC_URL = PREFIX + 'paymentPublic';
export const PAYMENT_REFERENCE_URL = PREFIX + 'paymentReference';
export const PAYMENT_TRANSACTION_URL = PREFIX + 'paymentTransaction';
export const PAYMENT_PROJECT_TRANSACTION_URL = PREFIX + 'paymentProjectTransaction';
export const PAYMENT_AGGREGATOR_URL = PREFIX + `payment-aggregator`;
export const PAYMENT_AGGREGATOR_CLOUD_PAYMENTS_PAY_CALLBACK = `${PAYMENT_AGGREGATOR_URL}/cloudpayments/callback/pay`

export const NALOG_SERACH_URL = PREFIX + 'nalog';
export const STATISTICS_URL = PREFIX + 'statistics';
export const LEDGER_OBJECT_DETAILS_URL = PREFIX + 'ledgerObjectDetails';

export const USER_PICTURE_UPLOAD_URL = PREFIX + 'user/picture/upload';
