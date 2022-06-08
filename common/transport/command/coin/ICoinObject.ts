import { IsString, IsEnum } from 'class-validator';

export interface ICoinObject {
    uid: string;
    type: CoinObjectType;
}

export enum CoinObjectType {
    COMPANY = 'COMPANY',
    PROJECT = 'PROJECT'
}

export class CoinObject implements ICoinObject {
    @IsString()
    uid: string;

    @IsEnum(CoinObjectType)
    type: CoinObjectType;
}
