import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { ProjectUserAddDto, IProjectUserAddDto } from './ProjectUserAddCommand';

export class ProjectUserEditCommand extends KarmaTransportCommandAsync<IProjectUserAddDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_USER_EDIT;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserAddDto) {
        super(ProjectUserEditCommand.NAME, TransformUtil.toClass(ProjectUserAddDto, request));
    }
}
