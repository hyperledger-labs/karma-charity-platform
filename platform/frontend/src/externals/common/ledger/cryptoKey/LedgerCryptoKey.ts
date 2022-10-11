import { IsEnum, IsString } from 'class-validator';
import { IUIDable } from '@ts-core/common';

export class LedgerCryptoKey implements IUIDable {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static PREFIX = 'cryptoKey';

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @IsString()
    uid: string;

    @IsString()
    value: string;

    @IsString()
    algorithm: string;
}
