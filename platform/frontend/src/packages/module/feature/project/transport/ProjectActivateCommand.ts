import { UserProject } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectActivateCommand extends TransportCommandAsync<IProjectActivateDto, IProjectActivateDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectActivateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectActivateDto) {
        super(ProjectActivateCommand.NAME, request);
    }
}

export type IProjectActivateDto = UserProject;
export type IProjectActivateDtoResponse = UserProject;
