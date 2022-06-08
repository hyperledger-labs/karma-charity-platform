import { Injectable } from '@angular/core';
import { Client } from '@common/platform/api';
import { LoginBaseService, CookieService, LoginNotGuard, LoginGuard, WindowService, LoginBaseServiceEvent } from '@ts-core/angular';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ILoginDto, ILoginDtoResponse, IInitDtoResponse, LoginResource } from '@common/platform/api/login';
import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import { RouterService } from './RouterService';

@Injectable({ providedIn: 'root' })
export class LoginService extends LoginBaseService<LoginServiceEvent, ILoginDtoResponse, IInitDtoResponse> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public isAutoLogin: boolean = true;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(router: RouterService, windows: WindowService, private cookies: CookieService, private api: Client, private social: SocialAuthService) {
        super();

        this.events.subscribe(data => {
            switch (data.type) {
                case LoginBaseServiceEvent.LOGIN_COMPLETE:
                    router.navigate(LoginNotGuard.redirectUrl);
                    break;
                case LoginBaseServiceEvent.LOGOUT_FINISHED:
                    router.navigate(LoginGuard.redirectUrl);
                    break;
                case LoginBaseServiceEvent.LOGOUT_STARTED:
                    windows.removeAll();
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

    protected loginSidRequest(): Promise<IInitDtoResponse> {
        this.api.sid = this.sid;
        return this.api.init();
    }

    protected async logoutRequest(): Promise<void> {
        await this.logoutSocial();
        try {
            await this.api.logout();
        }
        catch (error) { }
    }

    protected async logoutSocial(): Promise<void> {
        try {
            await this.social.signOut(true);
        }
        catch (error) { }
    }

    protected reset(): void {
        super.reset();
        this.logoutSocial();
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

    public async loginSocial(providerId: string, resource: LoginResource): Promise<SocialUser> {
        let item: SocialUser = null;
        try {
            item = await this.social.signIn(providerId);
            this.login({ data: { token: item.authToken }, resource });
        } catch (error: any) {
            if (!_.isString(error)) {
                error = JSON.stringify(error, null, 4);
            }
            try {
                await this.social.signOut(true);
            } catch (error: any) { }
            throw new ExtendedError(error, ExtendedError.HTTP_CODE_UNAUTHORIZED);
        }
        return item;
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
}

export enum LoginServiceEvent { }
