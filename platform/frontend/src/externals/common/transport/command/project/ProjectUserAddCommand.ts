import { ITraceable } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { Matches, IsOptional, IsEnum } from 'class-validator';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';
import { LedgerUser } from '../../../ledger/user';
import { LedgerProjectRole } from '../../../ledger/role';
import { IProjectUserIsInDto } from './ProjectUserIsInCommand';

export class ProjectUserAddCommand extends KarmaTransportCommandAsync<IProjectUserAddDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_USER_ADD;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserAddDto) {
        super(ProjectUserAddCommand.NAME, TransformUtil.toClass(ProjectUserAddDto, request));
    }
}

export interface IProjectUserAddDto extends IProjectUserIsInDto {
    roles?: Array<LedgerProjectRole>;
}

// export needs because another command use it
export class ProjectUserAddDto implements IProjectUserAddDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerProject.UID_REGXP)
    projectUid: string;

    @IsOptional()
    @IsEnum(LedgerProjectRole, { each: true })
    roles?: Array<LedgerProjectRole>;
}
