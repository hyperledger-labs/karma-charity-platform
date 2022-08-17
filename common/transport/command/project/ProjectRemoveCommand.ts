import { ITraceable } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';
import { Matches } from 'class-validator';
import { TransformUtil } from '@ts-core/common';

export class ProjectRemoveCommand extends KarmaTransportCommandAsync<IProjectRemoveDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_REMOVE;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectRemoveDto) {
        super(ProjectRemoveCommand.NAME, TransformUtil.toClass(ProjectRemoveDto, request));
    }
}

export interface IProjectRemoveDto extends ITraceable {
    uid: string;
}

class ProjectRemoveDto implements IProjectRemoveDto {
    @Matches(LedgerProject.UID_REGXP)
    uid: string;
}
