import { Injectable } from '@nestjs/common';
import { UnreachableStatementError } from '@ts-core/common/error';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { ILoginDto, ILoginDtoResponse, LoginResource } from '@project/common/platform/api/login';
import { UserEntity } from '@project/module/database/user';
import { UserStatus, USER_PREFERENCES_NAME_MIN_LENGTH } from '@project/common/platform/user';
import { DatabaseService } from '@project/module/database/service';
import { RandomUtil } from '@ts-core/common/util';
import { ILoginStrategy } from '../strategy/ILoginStrategy';
import { UserGuard } from '@project/module/guard';
import { GoogleSiteStrategy } from '../strategy';

@Injectable()
export class LoginService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static createLogin(id: string | number, resource: LoginResource): string {
        return `${resource}_${id}`;
    }

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private jwt: JwtService, private google: GoogleSiteStrategy) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private parseBeforeSave(user: UserEntity): void {
        let preference = user.preferences;
        if (_.isEmpty(preference.name)) {
            preference.name = RandomUtil.randomString(USER_PREFERENCES_NAME_MIN_LENGTH);
        } else if (preference.name.length < USER_PREFERENCES_NAME_MIN_LENGTH) {
            preference.name += RandomUtil.randomString(USER_PREFERENCES_NAME_MIN_LENGTH - preference.name.length);
        }
    }

    private getStrategy(data: ILoginDto): ILoginStrategy {
        switch (data.resource) {
            case LoginResource.GOOGLE:
                return this.google;
            case LoginResource.VK:
            case LoginResource.FACEBOOK:
                break;
            default:
                throw new UnreachableStatementError(data.resource);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async login(params: ILoginDto): Promise<ILoginDtoResponse> {
        let strategy = this.getStrategy(params);
        let profile = await strategy.getProfile(params);

        let item = await this.database.userGet(profile.login);
        if (_.isNil(item)) {
            item = await strategy.createUser(profile);
            this.parseBeforeSave(item);
            item = await this.database.user.save(item);
        }

        UserGuard.checkUser({ isRequired: true, status: [UserStatus.ACTIVE] }, item);

        let payload: LoginUser = { id: item.id, login: item.login, status: item.status };
        return { sid: this.jwt.sign(payload) };
    }
}

export interface LoginUser {
    id: number;
    login: string;
    status: UserStatus;
}
