import { UserEntity, UserPreferencesEntity } from '@project/module/database/user';
import * as _ from 'lodash';
import { LoginService, UserService } from '../service';
import { ILoginStrategy, ILoginStrategyProfile } from './ILoginStrategy';
import { DestroyableContainer } from '@ts-core/common';
import { ILoginAuthPassword, ILoginDto, IPasswordChangeDto, IRegisterDto, LoginUser } from '@project/common/platform/api/login';
import { UserResource, UserStatus, UserType } from '@project/common/platform/user';
import { RequestInvalidError, UserInvalidPasswordError, UserNotFoundError } from '@project/module/core/middleware';
import { DatabaseService } from '@project/module/database/service';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsError } from '@project/module/core/middleware';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordStrategy extends DestroyableContainer implements ILoginStrategy {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private database: DatabaseService, private user: UserService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async loadProfile(data: ILoginDto<ILoginAuthPassword>): Promise<LoginUser> {
        if (_.isEmpty(data.data.login)) {
            throw new RequestInvalidError({ name: 'data.data.login', value: null });
        }
        if (_.isEmpty(data.data.password)) {
            throw new RequestInvalidError({ name: 'data.data.password', value: null });
        }

        let id = data.data.login.toLocaleLowerCase();
        let user = await this.database.userGet(LoginService.createLogin(id, UserResource.PASSWORD))
        if (_.isNil(user) || !bcrypt.compareSync(data.data.password, user.password)) {
            throw new UserInvalidPasswordError();
        }
        return { id, preferences: { email: id } };
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async getProfile(data: ILoginDto<ILoginAuthPassword>): Promise<ILoginStrategyProfile> {
        let profile = await this.loadProfile(data);
        if (_.isNil(profile)) {
            throw new UserNotFoundError();
        }
        return {
            login: LoginService.createLogin(profile.id, UserResource.PASSWORD),
            profile
        }
    }

    public async createUser(data: ILoginStrategyProfile): Promise<UserEntity> {
        throw new UserNotFoundError();
    }

    public async register(params: IRegisterDto): Promise<UserEntity> {
        let login = LoginService.createLogin(params.email.toLowerCase(), UserResource.PASSWORD);
        let user = await this.database.userGet(login);
        if (!_.isNil(user)) {
            throw new UserAlreadyExistsError();
        }

        let item = new UserEntity();
        item.uid = UserService.uidCreate(login);
        item.type = UserType.UNDEFINED;
        item.login = login;
        item.status = UserStatus.ACTIVE;
        item.resource = UserResource.PASSWORD;
        item.cryptoKey = await this.user.cryptoKeyCreate();

        item.password = bcrypt.hashSync(params.password, 10);

        let preference = (item.preferences = new UserPreferencesEntity());
        preference.name = params.email;
        preference.email = params.email;

        return this.database.user.save(item);
    }

    public async passwordChange(item: UserEntity, passwordOld: string, passwordNew: string): Promise<UserEntity> {
        if (!bcrypt.compareSync(passwordOld, item.password)) {
            throw new UserInvalidPasswordError();
        }
        item.password = bcrypt.hashSync(passwordNew, 10);
        return this.database.user.save(item);
    }
}