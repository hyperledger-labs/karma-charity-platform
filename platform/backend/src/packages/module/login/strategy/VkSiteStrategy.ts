import { DestroyableContainer } from '@ts-core/common';
import { ObjectUtil, TransformUtil, DateUtil } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common';
import { UserEntity, UserPreferencesEntity } from '@project/module/database/user';
import { createHash } from 'crypto';
import { LoginService, UserService } from '../service';
import { ILoginStrategy, ILoginStrategyProfile } from './ILoginStrategy';
import { LoginSignatureInvalidError, LoginTokenExpiredError, LoginTokenInvalidError, RequestInvalidError } from '@project/module/core/middleware';
import * as _ from 'lodash';
import { UserStatus, UserType } from '@project/common/platform/user';
import { ILoginDto, LoginResource, LoginUser, VkLoginUser } from '@project/common/platform/api/login';
import { UserResource } from '@project/common/platform/user';

export class VkSiteStrategy extends DestroyableContainer implements ILoginStrategy {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private settings: IVkSiteStrategySettings, private user: UserService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async loadProfile(data: ILoginDto<VkLoginUser>): Promise<LoginUser> {
        let params = this.checkSignature(data.data.params);

        let item = TransformUtil.toClass(LoginUser, { id: params.get('mid'), preferences: {} });
        ObjectUtil.copyPartial(data.data, item, null, ['id']);

        return item;
    }

    private checkSignature(item: string): URLSearchParams {
        if (_.isNil(item)) {
            throw new LoginTokenInvalidError('user.params in nil');
        }

        let params = new URLSearchParams(item);
        ['expire', 'mid', 'secret', 'sid', 'sig'].forEach(item => {
            if (!params.has(item)) {
                throw new LoginTokenInvalidError(`user.params.${item} in nil`);
            }
        });

        let expire = DateUtil.MILLISECONDS_SECOND * Number(params.get('expire'));
        if (Date.now() > expire) {
            throw new LoginTokenExpiredError(expire, Date.now());
        }

        let data = ['expire', 'mid', 'secret', 'sid'].map(item => `${item}=${params.get(item)}`).join('') + this.settings.vkSiteSecret;
        let hash = createHash('md5').update(data).digest('hex');

        let signature = params.get('sig');
        if (hash !== signature) {
            throw new LoginSignatureInvalidError('sig', signature);
        }
        return params;
    }


    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getProfile(data: ILoginDto<VkLoginUser>): Promise<ILoginStrategyProfile> {
        let profile = await this.loadProfile(data);
        return {
            login: LoginService.createLogin(profile.id, UserResource.VK),
            profile
        }
    }

    public async createUser(data: ILoginStrategyProfile): Promise<UserEntity> {
        let item = new UserEntity();
        item.uid = UserService.uidCreate(data.login);
        item.type = UserType.UNDEFINED;
        item.login = data.login;
        item.status = UserStatus.ACTIVE;
        item.resource = UserResource.GOOGLE;
        item.cryptoKey = await this.user.cryptoKeyCreate();

        let profile = data.profile;
        let preference = (item.preferences = new UserPreferencesEntity());
        preference.name = profile.preferences.name;
        preference.email = profile.preferences.email;
        preference.picture = profile.preferences.picture;

        return item;
    }
}

export class IVkSiteStrategySettings {
    readonly vkSiteSecret: string;
}
