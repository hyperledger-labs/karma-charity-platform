import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { UserEntity, UserPreferencesEntity } from '@project/module/database/user';
import * as _ from 'lodash';
import axios from 'axios';
import { LoginService, UserService } from '../service';
import { ILoginStrategy, ILoginStrategyProfile } from './ILoginStrategy';
import { OAuth2Client } from 'google-auth-library';
import { DestroyableContainer } from '@ts-core/common';
import { ILoginDto, LoginResource, LoginUser } from '@project/common/platform/api/login';
import { ILoginAuthToken } from '@project/common/platform/api/login';
import { UserStatus, UserType } from '@project/common/platform/user';
import { LoginTokenExpiredError, LoginTokenInvalidError } from '@project/module/core/middleware';

export class GoogleSiteStrategy extends DestroyableContainer implements ILoginStrategy {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private client: OAuth2Client;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(settings: IGoogleSiteStrategySettings, private user: UserService) {
        super();
        this.client = new OAuth2Client(settings.googleSiteId, settings.googleSiteSecret, settings.googleSiteRedirectUri);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async loadProfile(data: ILoginDto<ILoginAuthToken>): Promise<LoginUser> {
        let token = null;

        try {
            let response = await this.client.getToken(data.data.token);
            token = response.tokens;
        }
        catch (error) {
            console.log(123, error);
            throw new LoginTokenInvalidError(error.message);
        }

        if (Date.now() > token.expiry_date) {
            throw new LoginTokenExpiredError(token.expiry_date, Date.now());
        }

        let item: LoginUser = null;
        try {
            let value = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { 'Authorization': `Bearer ${token.access_token}` } });
            item = TransformUtil.toClass(LoginUser, { id: value.data.sub, preferences: {} });
            ObjectUtil.copyProperties(value.data, item.preferences, ['name', 'picture', 'email'])
        }
        catch (error: any) {
            throw new LoginTokenInvalidError(error.message);
        }
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getProfile(data: ILoginDto<ILoginAuthToken>): Promise<ILoginStrategyProfile> {
        let profile = await this.loadProfile(data);
        return {
            login: LoginService.createLogin(profile.id, LoginResource.GOOGLE),
            profile
        }
    }

    public async createUser(data: ILoginStrategyProfile<LoginUser>): Promise<UserEntity> {
        let item = new UserEntity();
        item.uid = UserService.uidCreate(data.login);
        item.type = UserType.UNDEFINED;
        item.login = data.login;
        item.status = UserStatus.ACTIVE;
        item.resource = LoginResource.GOOGLE;
        item.cryptoKey = await this.user.cryptoKeyCreate();

        let profile = data.profile;
        let preference = (item.preferences = new UserPreferencesEntity());
        preference.name = profile.preferences.name;
        preference.email = profile.preferences.email;
        preference.picture = profile.preferences.picture;

        return item;
    }
}

export class IGoogleSiteStrategySettings {
    readonly googleSiteId: string;
    readonly googleSiteSecret: string;
    readonly googleSiteRedirectUri: string;
}
