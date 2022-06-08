import { Injectable } from '@nestjs/common';
import { UnreachableStatementError } from '@ts-core/common/error';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { ExtendedError } from '@ts-core/common/error';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { ILoginDto, ILoginDtoResponse, LoginResource } from '@project/common/platform/api/login';
import { UserEntity } from '@project/module/database/user';
import { GoogleStrategy } from '../strategy';
import { UserStatus, USER_PREFERENCES_NAME_MIN_LENGTH } from '@project/common/platform/user';
import { DatabaseService } from '@project/module/database/service';
import { RandomUtil, ValidateUtil } from '@ts-core/common/util';
import { Transport } from '@ts-core/common/transport';
import { ILoginStrategy } from '../strategy/ILoginStrategy';
import { UserStatusInvalidError } from '@project/module/core/middleware';

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

    constructor(logger: Logger, private database: DatabaseService, private jwt: JwtService, private google: GoogleStrategy) {
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
        ValidateUtil.validate(user);
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

        let user = await this.database.userGet(profile.login);

        if (_.isNil(user)) {
            user = await strategy.createUser(profile);
            this.parseBeforeSave(user);
            user = await this.database.userSave(user);
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new UserStatusInvalidError({ value: user.status, expected: UserStatus.ACTIVE });
        }

        let payload: LoginUser = { id: user.id, login: user.login, status: user.status };
        return { sid: this.jwt.sign(payload) };
    }
}

export interface LoginUser {
    id: number;
    login: string;
    status: UserStatus;
}
