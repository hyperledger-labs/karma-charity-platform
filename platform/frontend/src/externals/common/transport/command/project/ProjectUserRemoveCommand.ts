import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Matches } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';
import { LedgerUser } from '../../../ledger/user';

export class ProjectUserRemoveCommand extends KarmaTransportCommandAsync<IProjectUserRemoveDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_USER_REMOVE;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserRemoveDto) {
        super(ProjectUserRemoveCommand.NAME, TransformUtil.toClass(ProjectUserRemoveDto, request));
    }
}

export interface IProjectUserRemoveDto extends ITraceable {
    userUid: string;
    projectUid: string;
}

class ProjectUserRemoveDto implements IProjectUserRemoveDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerProject.UID_REGXP)
    projectUid: string;
}
