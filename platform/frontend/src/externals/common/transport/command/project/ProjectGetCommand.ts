import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { IsOptional, Matches, IsArray } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';

export class ProjectGetCommand extends KarmaTransportCommandAsync<IProjectGetDto, LedgerProject> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_GET;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectGetDto) {
        super(ProjectGetCommand.NAME, TransformUtil.toClass(ProjectGetDto, request), null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(item: LedgerProject): LedgerProject {
        return TransformUtil.toClass(LedgerProject, item);
    }
}

export interface IProjectGetDto extends ITraceable {
    uid: string;
    details?: Array<keyof LedgerProject>;
}

class ProjectGetDto implements IProjectGetDto {
    @Matches(LedgerProject.UID_REGXP)
    uid: string;

    @IsArray()
    @IsOptional()
    details?: Array<keyof LedgerProject>;
}
