import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';

export class UserGetCommand extends KarmaTransportCommandAsync<IUserGetDto, LedgerUser> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserGetDto) {
        super(UserGetCommand.NAME, TransformUtil.toClass(UserGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: LedgerUser): LedgerUser {
        return TransformUtil.toClass(LedgerUser, item);
    }
}

export interface IUserGetDto extends ITraceable {
    uid: string;
    details?: Array<keyof LedgerUser>;
}

class UserGetDto implements IUserGetDto {
    @Matches(LedgerUser.UID_REGXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof LedgerUser>;
}
