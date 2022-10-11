import { IKeyAsymmetric } from "@ts-core/common";
import { ValidateNested, IsOptional, IsDefined, IsString } from 'class-validator';
import { ISigner } from "./ISigner";
import { Type } from 'class-transformer';

export class KeyAsymmetric implements IKeyAsymmetric {
    @IsString()
    privateKey: string;
    @IsString()
    publicKey: string;
}

export class Signer implements ISigner {
    @IsString()
    uid: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    algorithm: string;

    @Type(() => KeyAsymmetric)
    @IsDefined()
    @ValidateNested()
    key: KeyAsymmetric;
}

