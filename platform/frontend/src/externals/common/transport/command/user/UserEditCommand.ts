import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';
import { Length, IsOptional, IsEnum, Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { RegExpUtil, ValidateUtil } from '../../../util';
import { LedgerRole } from '../../../ledger/role';

export class UserEditCommand extends KarmaTransportCommandAsync<IUserEditDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_EDIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserEditDto) {
        super(UserEditCommand.NAME, TransformUtil.toClass(UserEditDto, request));
    }
}

export interface IUserEditDto extends ITraceable {
    uid: string;
    roles?: Array<LedgerRole>;
    description?: string;
}

class UserEditDto implements IUserEditDto {
    @Matches(LedgerUser.UID_REGXP)
    uid: string;

    @IsOptional()
    @IsEnum(LedgerRole, { each: true })
    roles?: Array<LedgerRole>;

    @IsOptional()
    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description?: string;
}
