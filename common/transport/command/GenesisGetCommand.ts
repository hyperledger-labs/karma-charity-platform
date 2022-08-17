import { KarmaLedgerCommand, KarmaTransportCommandAsync } from './KarmaLedgerCommand';
import { IGenesis } from '../../ledger';
import { LedgerUser } from '../../ledger/user';
import { TransformUtil } from '@ts-core/common';
import { Matches, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { LedgerCompany } from '../../ledger/company';

export class GenesisGetCommand extends KarmaTransportCommandAsync<void, IGenesis> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.GENESIS_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(GenesisGetCommand.NAME, null, null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: IGenesis): IGenesis {
        return TransformUtil.toClass(Genesis, item);
    }
}

export class Genesis implements IGenesis {
    @Matches(LedgerUser.UID_REGXP)
    rootUserUid: string;

    @Matches(LedgerCompany.UID_REGXP)
    rootCompanyUid: string;

    @Type(() => Date)
    @IsDate()
    createdDate: Date;
}
