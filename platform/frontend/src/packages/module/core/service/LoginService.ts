import { Injectable } from '@angular/core';
import { Client } from '@common/platform/api';
import { LoginBaseService, CookieService, LoginBaseServiceEvent } from '@ts-core/angular';
import { ILoginDto, ILoginDtoResponse, IInitDtoResponse, LoginResource } from '@common/platform/api/login';
import { ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';
import { GoExternalLoginCommand, GoExternalLogoutCommand } from '@feature/go-external/transport';
import { Transport, TransportNoConnectionError, TransportTimeoutError } from '@ts-core/common';
import { VkExternalLoginCommand, VkExternalLogoutCommand } from '@feature/vk-external/transport';

@Injectable({ providedIn: 'root' })
export class LoginService extends LoginBaseService<LoginServiceEvent, ILoginDtoResponse, IInitDtoResponse> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public isAutoLogin: boolean = true;
    protected _resource: LoginResource;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private transport: Transport, private cookies: CookieService, private api: Client) {
        super();

        // Login
        this.events.subscribe(data => {
            switch (data.type) {
                case LoginBaseServiceEvent.LOGOUT_STARTED:
                    this.logoutSocial()
                    break;
            }
        });
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected loginRequest(data: ILoginDto): Promise<ILoginDtoResponse> {
        return this.api.login(data);
    }

    protected parseLoginResponse(data: ILoginDtoResponse): void {
        this._sid = data.sid;
        if (this.sid) {
            this.cookies.put('sid', this.sid);
        } else {
            this.cookies.remove('sid');
        }
    }

    protected parseLoginSidErrorResponse(error: ExtendedError): void {
        if (error instanceof TransportTimeoutError || error instanceof TransportNoConnectionError) {
            return;
        }
        this.logoutSocial();
        this.reset();
    }

    protected loginSidRequest(): Promise<IInitDtoResponse> {
        this.api.sid = this.sid;
        return this.api.init();
    }

    protected async logoutRequest(): Promise<void> {
        return this.api.logout();
    }

    protected async logoutSocial(): Promise<void> {
        switch (this.resource) {
            case LoginResource.VK_SITE:
                this.transport.send(new VkExternalLogoutCommand());
                break;
            case LoginResource.GOOGLE_SITE:
                this.transport.send(new GoExternalLogoutCommand());
                break;
        }
    }

    protected reset(): void {
        super.reset();
        this._resource = null;
        this.cookies.remove('sid');
        this.cookies.remove('resource');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public login<ILoginDto>(param: ILoginDto): void {
        super.loginByParam(param);
    }

    public async loginSocial(resource: LoginResource): Promise<void> {
        let item: ILoginDto = null;
        switch (resource) {
            case LoginResource.GOOGLE_SITE:
                item = await this.transport.sendListen(new GoExternalLoginCommand());
                break;
            case LoginResource.VK_SITE:
                item = await this.transport.sendListen(new VkExternalLoginCommand());
                break;
            default:
                throw new ExtendedError(`Unable to login: "${resource}" resource doesn't support`)
        }
        if (!_.isNil(item)) {
            this.login(item);
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    //--------------------------------------------------------------------------

    protected getSavedSid(): string {
        return this.cookies.get('sid');
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get sid(): string {
        return this._sid;
    }

    public get resource(): LoginResource {
        return this._resource;
    }
}

export enum LoginServiceEvent { }
