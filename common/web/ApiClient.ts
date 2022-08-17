import { TransportHttpCommandAsync, ITransportHttpRequest, ITransportHttpSettings } from '@ts-core/common';
import { TransportHttp } from '@ts-core/common';
import { ILogger } from '@ts-core/common';
import { IUserList } from './user/IUserList';
import { ICreateStaffDto, IUser, IInviteDto, IUserUpdatePasswordDto, IEmailDto, IResetPasswordDto, IUserExtended } from './user';
import { ILoginDtoResponse } from './auth/ILoginDtoResponse';
import { ILoginDto } from './auth/ILoginDto';
import { IProjectCreateDto } from './project/dto/IProjectCreateDto';
import { IProject, IProjectExtended } from './project/IProject';
import { INkoStaffRegisterDto } from './user/nko/INkoStaffRegisterDto';
import { INkoStaffConfirmDto } from './user/nko/INkoStaffConfirmDto';
import { IProjectListDto } from './project/dto/IProjectListDto';
import { IProjectList } from './project/IProjectList';
import { IProjectUpdateDto } from '../web/project/dto';
import { Method } from 'axios';
import * as _ from 'lodash';
import { Destroyable } from '@ts-core/common';
import { IUserInfo } from './user/IUserInfo';
import { IUserListDto } from './user/IUserListDto';
import { ICompany, ICompanyExtended } from './company/ICompany';
import { ICompanyCreateDto } from './company/dto/ICompanyCreateDto';
import { ICompanyList } from './company/ICompanyList';
import { ICompanyListDto } from './company/dto/ICompanyListDto';
import { ICreateDonateDto } from './payment/dto/ICreateDonateDto';
import { IDonaterRegisterDto } from './user/donater/IDonaterRegisterDto';
import { IPaymentListDto } from './payment/dto';
import { IPaymentList, IPaymentExtended } from './payment';
import { IImageUpload64 } from './image/IImageUpload64';
import { IImageUrl } from './image/IImageUrl';
import { ICompanyPublicList, ICompanyPublicExtended, ICompanyPublic } from './company';
import { ObjectUtil } from '@ts-core/common';
import { IDocumentList } from './document/IDocument';
import { IUserUpdateDto } from './user/IUserUpdateDto';
import { ICompanyUpdateDto } from './company/dto/ICompanyUpdateDto';

export class ApiClient extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    private static parseDateItem(item: any): any {
        if (_.isNil(item)) {
            return item;
        }
        if (ObjectUtil.hasOwnProperty(item, 'createdAt')) {
            item.createdAt = new Date(item.createdAt);
        }
        if (ObjectUtil.hasOwnProperty(item, 'updatedAt')) {
            item.updatedAt = new Date(item.updatedAt);
        }
        return item;
    }

    private static parseCompany<T extends ICompany | ICompanyPublic>(item: T): T {
        if (_.isNil(item)) {
            return item;
        }
        ApiClient.parseDateItem(item);
        if (ObjectUtil.hasOwnProperty(item, 'details')) {
            item['details'].registrationDate = new Date(item['details'].registrationDate);
        }
        return item;
    }
    private static parseCompanies<T extends ICompanyList | ICompanyPublicList>(item: T): T {
        item.items.forEach(ApiClient.parseCompany);
        return item;
    }

    private static parseUser<T extends IUser>(item: T): T {
        return ApiClient.parseDateItem(item);
    }
    private static parseUsers<T extends IUserList>(item: T): T {
        item.items.forEach(ApiClient.parseUser);
        return item;
    }

    private static parseProject<T extends IProject | IProjectExtended>(item: T): T {
        return ApiClient.parseDateItem(item);
    }
    private static parseProjects<T extends IProjectList>(item: T): T {
        item.items.forEach(ApiClient.parseProject);
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected _http: TransportHttp;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, url?: string) {
        super();
        this._http = new TransportHttp(logger, { method: 'get', isHandleError: true, isHandleLoading: true, headers: {} });
        if (!_.isNil(url)) {
            this.url = url;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Auth
    //
    // --------------------------------------------------------------------------

    async login(data: ILoginDto): Promise<ILoginDtoResponse> {
        return await this.sendRequest<ILoginDtoResponse>('api/auth/login', { data }, 'post');
    }

    async logout(): Promise<void> {
        await this.withAuth<void>('api/auth/logout', {}, 'post');
    }

    async me(): Promise<IUserInfo> {
        let item = await this.withAuth<IUserInfo>('api/auth/me');
        item.company = ApiClient.parseCompany(item.company);
        item.user = ApiClient.parseUser(item.user);
        return item;
    }

    async forgotPassword(data: IEmailDto): Promise<void> {
        this.withAuth<void>('api/auth/password/forgot', { data }, 'post');
    }

    async resetPassword(data: IResetPasswordDto): Promise<void> {
        this.withAuth<void>('api/auth/password/reset', { data }, 'post');
    }

    // --------------------------------------------------------------------------
    //
    //  User
    //
    // --------------------------------------------------------------------------

    async getUserList(data?: IUserListDto): Promise<IUserList> {
        return ApiClient.parseUsers(
            await this.withAuth<IUserList>('api/user', { data })
        );
    }

    async createStaffUser(data: ICreateStaffDto): Promise<IUser> {
        return ApiClient.parseUser(await this.withAuth<IUser>('api/user', { data }, 'post'));
    }

    async inviteUser(data: IInviteDto): Promise<IUser> {
        return ApiClient.parseUser(await this.sendRequest<IUser>('api/user/invite', { data }, 'post'));
    }

    async getUser(id: number): Promise<IUserExtended> {
        return ApiClient.parseUser(await this.withAuth<IUser>(`api/user/${id}`));
    }

    async updateUser(data: IUserUpdateDto): Promise<IUserExtended> {
        return ApiClient.parseUser(await this.withAuth<IUserExtended>('api/user', { data }, 'patch'));
    }

    async updatePassword(data: IUserUpdatePasswordDto): Promise<IUser> {
        return ApiClient.parseUser(await this.withAuth<IUser>(`api/user/password/update`, { data }, 'post'));
    }

    // --------------------------------------------------------------------------
    //
    //  User NKO
    //
    // --------------------------------------------------------------------------

    async registerNkoStaff(data: INkoStaffRegisterDto): Promise<IUser> {
        return ApiClient.parseUser(await this.sendRequest<IUser>('api/user/nko/register', { data }, 'post'));
    }

    async confirmNkoStaff(data: INkoStaffConfirmDto): Promise<ILoginDtoResponse> {
        return this.sendRequest<ILoginDtoResponse>('api/user/nko/confirm', { data }, 'post');
    }

    async forceConfirmNkoStaff(id: number): Promise<ILoginDtoResponse> {
        return this.sendRequest<ILoginDtoResponse>(`api/user/nko/${id}/forceConfirm`, {}, 'post');
    }

    async verifyNkoStaff(id: number): Promise<ILoginDtoResponse> {
        return this.withAuth<ILoginDtoResponse>(`api/user/nko/${id}/verify`, { data: { id } }, 'post');
    }

    // --------------------------------------------------------------------------
    //
    //  Donater
    //
    // --------------------------------------------------------------------------

    async registerDonater(data: IDonaterRegisterDto): Promise<IUser> {
        return ApiClient.parseUser(await this.sendRequest<IUser>('user/donater/register', { data }, 'post'));
    }

    // --------------------------------------------------------------------------
    //
    //  Company
    //
    // --------------------------------------------------------------------------

    async getCompanyList(data?: ICompanyListDto): Promise<ICompanyList> {
        return ApiClient.parseCompanies(
            await this.withAuth<ICompanyList>('api/company', { data })
        );
    }

    async createCompany(data: ICompanyCreateDto): Promise<ICompany> {
        return ApiClient.parseCompany(await this.withAuth<ICompany>('api/company', { data }, 'post'));
    }

    async updateCompany(data: ICompanyUpdateDto): Promise<ICompany> {
        return ApiClient.parseCompany(await this.withAuth<ICompany>('api/company', { data }, 'patch'));
    }

    async getCompany(id: number): Promise<ICompanyExtended> {
        return ApiClient.parseCompany(await this.withAuth<ICompanyExtended>(`api/company/${id}`));
    }

    async sendCompanyForVerification(id: number): Promise<ICompany> {
        return ApiClient.parseCompany(await this.withAuth<ICompany>(`api/company/${id}/sendForVerification`, {}, 'post'));
    }

    async verifyCompany(id: number): Promise<ICompany> {
        return ApiClient.parseCompany(await this.withAuth<ICompany>(`api/company/${id}/verify`, {}, 'post'));
    }

    async rejectCompany(id: number): Promise<ICompany> {
        return ApiClient.parseCompany(await this.withAuth<ICompany>(`api/company/${id}/reject`, {}, 'post'));
    }

    async redraftCompany(id: number): Promise<ICompany> {
        return ApiClient.parseCompany(await this.withAuth<ICompany>(`api/company/${id}/redraft`, {}, 'post'));
    }

    async donateToCompany(id: number, data: ICreateDonateDto, isAnonymous = false): Promise<ICompany> {
        let item: ICompany = null;
        if (isAnonymous) {
            // need reset headers
            item = await this.sendRequest<ICompany>(`api/company/${id}/donate`, { data }, 'post');
        }
        item = await this.withAuth<ICompany>(`api/company/${id}/donate`, { data }, 'post');
        return ApiClient.parseCompany(item);
    }

    async getCompanyPublicList(data?: ICompanyListDto): Promise<ICompanyPublicList> {
        return this.sendRequest<ICompanyPublicList>('company', { data });
    }

    async getCompanyPublic(id: number): Promise<ICompanyPublicExtended> {
        return this.sendRequest<ICompanyPublicExtended>(`company/${id}`);
    }

    // --------------------------------------------------------------------------
    //
    //  Project
    //
    // --------------------------------------------------------------------------

    async getProjectList(data?: IProjectListDto): Promise<IProjectList> {
        return ApiClient.parseProjects(
            await this.withAuth<IProjectList>('api/project', { data })
        );
    }

    async createProject(data: IProjectCreateDto): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>('api/project', { data }, 'post'));
    }

    async getProject(id: number): Promise<IProjectExtended> {
        return ApiClient.parseProject(await this.withAuth<IProjectExtended>(`api/project/${id}`));
    }

    async updateProject(id: number, data: IProjectUpdateDto): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}`, { data }, 'put'));
    }

    async sendProjectForVerification(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/sendForVerification`, {}, 'post'));
    }

    async verifyProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/verify`, {}, 'post'));
    }

    async redraftProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/redraft`, {}, 'post'));
    }

    async activateProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/activate`, {}, 'post'));
    }

    async rejectProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/reject`, {}, 'post'));
    }

    async closeProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/close`, {}, 'post'));
    }

    async donateToProject(id: number, data: ICreateDonateDto, isAnonymous: boolean = false): Promise<IProject> {
        let item = isAnonymous
            ? await this.sendRequest<IProject>(`project/${id}/donate`, { data }, 'post')
            : await this.withAuth<IProject>(`project/${id}/donate`, { data }, 'post');
        return ApiClient.parseProject(item);
    }

    async prepareWithdrawalForProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/prepareWithdrawal`, {}, 'put'));
    }

    async withdrawFromProject(id: number): Promise<IProject> {
        return ApiClient.parseProject(await this.withAuth<IProject>(`api/project/${id}/withdraw`, {}, 'put'));
    }

    async waitForReportForProject(id: number): Promise<IProject> {
        return this.withAuth<IProject>(`api/project/${id}/waitForReport`, {});
    }

    async uploadDocumentsForProject(id: number): Promise<IDocumentList> {
        return this.withAuth<IDocumentList>(`api/project/${id}/uploadDocuments`, {});
    }

    async completeProject(id: number): Promise<IProject> {
        return this.withAuth<IProject>(`api/project/${id}/complete`, {});
    }

    async getProjectPublic(id: number): Promise<IProjectExtended> {
        return ApiClient.parseProject(await this.sendRequest<IProjectExtended>(`project/${id}`));
    }

    async getProjectListPublic(data?: IProjectListDto): Promise<IProjectList> {
        return ApiClient.parseProjects(
            await this.sendRequest<IProjectList>('project', { data })
        );
    }

    // --------------------------------------------------------------------------
    //
    //  Payment
    //
    // --------------------------------------------------------------------------

    async getPaymentList(data?: IPaymentListDto): Promise<IPaymentList> {
        return this.withAuth<IPaymentList>('payment', { data });
    }

    async getPayment(id: number): Promise<IPaymentExtended> {
        return this.withAuth<IPaymentExtended>(`payment/${id}`);
    }

    // --------------------------------------------------------------------------
    //
    //  Dictionary
    //
    // --------------------------------------------------------------------------

    async getDictionary(name: string): Promise<Array<string>> {
        let items = await this.sendRequest<Array<any>>(`api/dict/${name}`);
        return items.map(item => item.name);
    }

    // --------------------------------------------------------------------------
    //
    //  Image
    //
    // --------------------------------------------------------------------------

    async uploadImage64(data: IImageUpload64): Promise<IImageUrl> {
        return this.withAuth<IImageUrl>('api/image/upload64', { data }, 'post');
    }

    // --------------------------------------------------------------------------
    //
    //  System
    //
    // --------------------------------------------------------------------------

    async processPaymentCallback(paymentId: number, externalId: string): Promise<any> {
        return this.sendRequest(`callback/payment`, { data: { paymentId, externalId } }, 'post');
    }

    // --------------------------------------------------------------------------
    //
    //  Public
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this._http.destroy();
        this._http = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Private
    //
    // --------------------------------------------------------------------------

    private async sendRequest<V, U = any>(path: string, request?: ITransportHttpRequest, method: Method = 'get'): Promise<V> {
        const data = request ? request.data : {};
        return await this.http.sendListen(
            new TransportHttpCommandAsync<V, U>(path, { data, method })
        );
    }

    private async withAuth<V, U = any>(path: string, request?: ITransportHttpRequest, method: Method = 'get'): Promise<V> {
        if (_.isNil(this.headers) || _.isNil(this.headers.Authorization)) {
            throw new Error('Authorization headers are required');
        }
        return this.sendRequest<V, U>(path, request, method);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    private get headers(): any {
        return !_.isNil(this.settings) ? this.settings.headers : null;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get imageUploadUrl(): string {
        return `${this.url}/api/image/upload`;
    }

    public get url(): string {
        return !_.isNil(this.http) ? this.http.url : null;
    }

    public set url(value: string) {
        if (!_.isNil(this.http)) {
            this.http.url = value;
        }
    }

    public set token(value: string) {
        if (!_.isNil(this.headers)) {
            this.headers.Authorization = !_.isNil(value) ? `Bearer ${value}` : null;
        }
    }

    public get settings(): ITransportHttpSettings {
        return !_.isNil(this.http) ? this.http.settings : null;
    }

    public get http(): TransportHttp {
        return this._http;
    }
}
