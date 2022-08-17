
import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';
import { Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';

export class UserRemoveCommand extends KarmaTransportCommandAsync<IUserRemoveDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_REMOVE;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserRemoveDto) {
        super(UserRemoveCommand.NAME, TransformUtil.toClass(UserRemoveDto, request));
    }
}

export interface IUserRemoveDto extends ITraceable {
    uid: string;
}

class UserRemoveDto implements IUserRemoveDto {
    @Matches(LedgerUser.UID_REGXP)
    uid: string;
}
