import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';
import { LedgerUser } from '../../../ledger/user';

export class ProjectUserIsInCommand extends KarmaTransportCommandAsync<IProjectUserIsInDto, IProjectUserIsInDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_USER_IS_IN;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserIsInDto) {
        super(ProjectUserIsInCommand.NAME, TransformUtil.toClass(ProjectUserIsInDto, request), null, true);
    }
}

export interface IProjectUserIsInDto extends ITraceable {
    userUid: string;
    projectUid: string;
}

class ProjectUserIsInDto implements IProjectUserIsInDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerProject.UID_REGXP)
    projectUid: string;
}

export type IProjectUserIsInDtoResponse = boolean;
