import { TransportCommandAsync } from '@ts-core/common/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';

export class CryptoDecryptCommand extends TransportCommandAsync<ICryptoDecryptDto, string> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CryptoDecryptCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICryptoDecryptDto) {
        super(CryptoDecryptCommand.NAME, request);
    }
}

export interface ICryptoDecryptDto {
    type: CryptoKeyType;
    value: string;
}