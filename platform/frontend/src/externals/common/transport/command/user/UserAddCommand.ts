import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { LedgerUser } from '../../../ledger/user';
import { IsString, IsDate, IsEnum, Length, ValidateNested, Matches, IsOptional, IsDefined } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { RegExpUtil, ValidateUtil } from '../../../util';
import { Type } from 'class-transformer';
import { LedgerRole } from '../../../ledger/role';

export class UserAddCommand extends KarmaTransportCommandAsync<IUserAddDto, LedgerUser> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserAddDto) {
        super(UserAddCommand.NAME, TransformUtil.toClass(UserAddDto, request));
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

export interface IUserCryptoKey {
    value: string;
    algorithm: string;
}

export interface IUserAddDto extends ITraceable {
    cryptoKey: IUserCryptoKey;
    description?: string;

    roles?: Array<LedgerRole>;
}

export class UserCryptoKey implements IUserCryptoKey {
    @IsString()
    value: string;

    @IsString()
    algorithm: string;
}

export class UserAddDto implements IUserAddDto {
    @Type(() => UserCryptoKey)
    @IsDefined()
    @ValidateNested()
    cryptoKey: UserCryptoKey;


    @IsOptional()
    @IsEnum(LedgerRole, { each: true })
    roles?: Array<LedgerRole>;

    @IsOptional()
    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description?: string;
}
