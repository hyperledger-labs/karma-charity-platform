import { ILoginDto } from "@project/common/platform/api/login";
import { UserEntity } from "@project/module/database/user";

export interface ILoginStrategy<T = any> {
    getProfile(data: ILoginDto): Promise<ILoginStrategyProfile<T>>;
    createUser(data: ILoginStrategyProfile<T>): Promise<UserEntity>;
}

export interface ILoginStrategyProfile<T = any> {
    login: string;
    profile: T;
}