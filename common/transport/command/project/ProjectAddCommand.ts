import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';
import { Length, Matches, ValidateNested, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { RegExpUtil, ValidateUtil } from '../../../util';
import { LedgerCompany } from '../../../ledger/company';
import { LedgerUser } from '../../../ledger/user';
import { Type } from 'class-transformer';
import { ILedgerProjectPurpose, LedgerProjectPurpose } from '../../../ledger/project';

export class ProjectAddCommand extends KarmaTransportCommandAsync<IProjectAddDto, LedgerProject> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectAddDto) {
        super(ProjectAddCommand.NAME, TransformUtil.toClass(ProjectAddDto, request));
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

export interface IProjectAddDto extends ITraceable {
    ownerUid: string;
    companyUid: string;
    description: string;
    purposes: Array<ILedgerProjectPurpose>;
}

export class ProjectAddDto implements IProjectAddDto {
    @Matches(LedgerUser.UID_REGXP)
    ownerUid: string;

    @Matches(LedgerCompany.UID_REGXP)
    companyUid: string;

    @Length(ValidateUtil.DESCRIPTION_MIN_LENGTH, ValidateUtil.DESCRIPTION_MAX_LENGTH)
    @Matches(RegExpUtil.DESCRIPTION)
    description: string;

    @IsArray()
    @ArrayMinSize(ValidateUtil.PROJECT_PURPOSES_MIN_LENGTH)
    @ArrayMaxSize(ValidateUtil.PROJECT_PURPOSES_MAX_LENGTH)
    @Type(() => LedgerProjectPurpose)
    @ValidateNested({ each: true })
    purposes: Array<LedgerProjectPurpose>;
}
