import { TransportCommandAsync, ITransportCommand } from '@ts-core/common/transport';
import { ISignature } from '@ts-core/common/crypto';

export class CryptoLedgerSignCommand extends TransportCommandAsync<ICryptoLedgerSignDto, ISignature> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CryptoLedgerSignCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ICryptoLedgerSignDto) {
        super(CryptoLedgerSignCommand.NAME, request);
    }
}

export interface ICryptoLedgerSignDto<U = any> {
    uid: string;
    command: ITransportCommand<U>;
    isDisableDecryption?: boolean;
}