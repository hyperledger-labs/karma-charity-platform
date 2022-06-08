import { ITraceable } from '@ts-core/common/trace';
import { LoginResource } from './LoginResource';

export interface ILoginDto<T = any> extends ITraceable {
    data: T;
    resource: LoginResource;
}

export interface ILoginDtoResponse {
    sid: string;
}
