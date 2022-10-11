import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';
import { IsDefined, ValidateNested, Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { IUserCryptoKey, UserCryptoKey } from './UserAddCommand';
import { Type } from 'class-transformer';

export class UserCryptoKeyChangeCommand extends KarmaTransportCommandAsync<IUserCryptoKeyChangeDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_CRYPTO_KEY_CHANGE;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserCryptoKeyChangeDto) {
        super(UserCryptoKeyChangeCommand.NAME, TransformUtil.toClass(UserCryptoKeyChangeDto, request));
    }
}

export interface IUserCryptoKeyChangeDto extends ITraceable {
    uid: string;
    cryptoKey: IUserCryptoKey;
}

class UserCryptoKeyChangeDto implements IUserCryptoKeyChangeDto {
    @Matches(LedgerUser.UID_REGXP)
    uid: string;

    @Type(() => UserCryptoKey)
    @IsDefined()
    @ValidateNested()
    cryptoKey: UserCryptoKey;
}
