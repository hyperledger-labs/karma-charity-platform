import { UserProject } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectToVerifyCommand extends TransportCommandAsync<IProjectToVerifyDto, IProjectToVerifyDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectToVerifyCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectToVerifyDto) {
        super(ProjectToVerifyCommand.NAME, request);
    }
}

export type IProjectToVerifyDto = UserProject;
export type IProjectToVerifyDtoResponse = UserProject;
