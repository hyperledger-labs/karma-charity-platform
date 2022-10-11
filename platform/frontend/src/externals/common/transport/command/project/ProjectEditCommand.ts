import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';
import { ITraceable } from '@ts-core/common';
import { Length, IsOptional, Matches } from 'class-validator';
import { RegExpUtil, ValidateUtil } from '../../../util';
import { TransformUtil } from '@ts-core/common';

export class ProjectEditCommand extends KarmaTransportCommandAsync<IProjectEditDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_EDIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectEditDto) {
        super(ProjectEditCommand.NAME, TransformUtil.toClass(ProjectEditDto, request));
    }
}

export interface IProjectEditDto extends ITraceable {
    uid: string;
    description?: string;
}

class ProjectEditDto implements IProjectEditDto {
    @Matches(LedgerProject.UID_REGXP)
    uid: string;

    @IsOptional()
    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description?: string;
}
