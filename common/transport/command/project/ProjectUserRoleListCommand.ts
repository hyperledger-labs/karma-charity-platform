import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerUser } from '../../../ledger/user';
import { ITraceable } from '@ts-core/common';
import { Matches } from 'class-validator';
import { LedgerProject } from '../../../ledger/project';
import { LedgerProjectRole } from '../../../ledger/role';

export class ProjectUserRoleListCommand extends KarmaTransportCommandAsync<IProjectUserRoleListDto, IProjectUserRoleListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_USER_ROLE_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserRoleListDto) {
        super(ProjectUserRoleListCommand.NAME, TransformUtil.toClass(ProjectUserRoleListDto, request), null, true);
    }
}

export interface IProjectUserRoleListDto extends ITraceable {
    userUid: string;
    projectUid: string;
}

export type IProjectUserRoleListDtoResponse = Array<LedgerProjectRole>;

class ProjectUserRoleListDto implements IProjectUserRoleListDto {
    @Matches(LedgerUser.UID_REGXP)
    userUid: string;

    @Matches(LedgerProject.UID_REGXP)
    projectUid: string;
}
