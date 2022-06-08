import { PassportStrategy } from '@nestjs/passport';
import { ExtendedError } from '@ts-core/common/error';
import { PromiseHandler } from '@ts-core/common/promise';
import { UserStatus, UserType } from '@project/common/platform/user';
import { Strategy } from 'passport-google-oauth20';
import { UserEntity, UserPreferencesEntity } from '@project/module/database/user';
import * as _ from 'lodash';
import { ILoginDto, LoginResource } from '@project/common/platform/api/login';
import { LoginService, UserService } from '../service';
import { ILoginStrategy, ILoginStrategyProfile } from './ILoginStrategy';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') implements ILoginStrategy<any> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(settings: IGoogleStrategySettings, private user: UserService) {
        super({
            scope: settings.googleScope,
            clientID: settings.googleClientId,
            clientSecret: settings.googleSecret,
            callbackURL: settings.googleCallbackUrl
        });
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async loadProfile(data: ILoginDto): Promise<any> {
        let promise = PromiseHandler.create<any, ExtendedError>();
        this.userProfile(data.data.token, async (error, data) => {
            if (_.isNil(error)) {
                promise.resolve(data);
            } else {
                promise.reject(ExtendedError.create(error, ExtendedError.HTTP_CODE_UNAUTHORIZED));
            }
        });
        return promise.promise;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getProfile(data: ILoginDto): Promise<ILoginStrategyProfile> {
        let profile = await this.loadProfile(data);
        return {
            login: LoginService.createLogin(profile.id, LoginResource.GOOGLE),
            profile
        }
    }

    public async createUser(data: ILoginStrategyProfile): Promise<UserEntity> {
        let item = new UserEntity();
        item.uid = UserService.uidCreate(data.login);
        item.type = UserType.UNDEFINED;
        item.login = data.login;
        item.status = UserStatus.ACTIVE;
        item.resource = LoginResource.GOOGLE;
        item.cryptoKey = await this.user.cryptoKeyCreate();

        let profile = data.profile;
        let preference = (item.preferences = new UserPreferencesEntity());
        preference.name = profile.displayName;
        if (!_.isEmpty(profile.emails)) {
            preference.email = profile.emails[0].value;
        }
        if (!_.isEmpty(profile.photos)) {
            preference.picture = profile.photos[0].value;
        }
        return item;
    }
}

export class IGoogleStrategySettings {
    readonly googleSecret: string;
    readonly googleClientId: string;
    readonly googleCallbackUrl: string;
    readonly googleScope: Array<string>;
}
