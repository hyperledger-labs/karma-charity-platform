import { Injectable } from '@angular/core';
import { UserBaseService, UserBaseServiceEvent } from '@ts-core/angular';
import { LoginService } from './LoginService';
import { IInitDtoResponse } from '@common/platform/api/login';
import { User } from '../lib/user';
import { TransformUtil } from '@ts-core/common/util';
import { UserPreferences, UserType } from '@common/platform/user';
import * as _ from 'lodash';
import { ExtendedError } from '@ts-core/common/error';
import { Transport } from '@ts-core/common/transport';
import { UserSaveCommand } from '../../feature/user/transport';

@Injectable({ providedIn: 'root' })
export class UserService extends UserBaseService<User, UserServiceEvent> {

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(login: LoginService, private transport: Transport) {
        super(login);
        this.initialize();
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected createUser(data: IInitDtoResponse): User {
        let item = TransformUtil.toClass(User, data.user);
        return item;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async save(item: Partial<UserPreferences>): Promise<boolean> {
        if (_.isNil(this.preferences)) {
            throw new ExtendedError('Unable to save user preferences: user is not logined');
        }

        for (let key of Object.keys(item)) {
            if (item[key] === this.preferences[key]) {
                delete item[key];
            }
        }

        if (_.isEmpty(item)) {
            return false;
        }
        await this.transport.sendListen(new UserSaveCommand({ id: this.user.id, preferences: item }));
        return true;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get preferences(): UserPreferences {
        return this.isLogined ? this.user.preferences : null;
    }
    public get isDonor(): boolean {
        return this.hasUser ? this.user.type === UserType.DONOR : false;
    }
    public get isEditor(): boolean {
        return this.hasUser ? this.user.type === UserType.EDITOR : false;
    }
    public get isUndefined(): boolean {
        return this.hasUser ? this.user.type === UserType.UNDEFINED : false;
    }
    public get isAdministrator(): boolean {
        return this.hasUser ? this.user.type === UserType.ADMINISTRATOR : false;
    }
    public get isCompanyWorker(): boolean {
        return this.hasUser ? this.user.type === UserType.COMPANY_WORKER : false;
    }
    public get isCompanyManager(): boolean {
        return this.hasUser ? this.user.type === UserType.COMPANY_MANAGER : false;
    }
}

export enum UserServiceEvent { }
