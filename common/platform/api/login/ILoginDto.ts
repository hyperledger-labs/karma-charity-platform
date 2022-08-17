import { ITraceable } from '@ts-core/common';
import { ILoginAuthToken } from './ILoginAuthToken';
import { LoginUser } from './ILoginUser';
import { LoginResource } from './LoginResource';

export interface ILoginDto<T = any> extends ITraceable {
    data: T;
    resource: LoginResource;
}

export interface ILoginDtoResponse {
    sid: string;
}

export type LoginData = ILoginAuthToken | LoginUser;