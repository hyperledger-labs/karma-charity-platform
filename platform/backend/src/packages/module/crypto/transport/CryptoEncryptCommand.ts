import { TransportCommandAsync } from '@ts-core/common/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';

export class CryptoEncryptCommand extends TransportCommandAsync<ICryptoEncryptDto, string> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CryptoEncryptCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICryptoEncryptDto) {
        super(CryptoEncryptCommand.NAME, request);
    }
}

export interface ICryptoEncryptDto {
    type: CryptoKeyType;
    value: string;
}