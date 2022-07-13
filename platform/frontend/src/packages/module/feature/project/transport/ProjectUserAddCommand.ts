import { UserProject } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectUserAddCommand extends TransportCommandAsync<IProjectUserAddDto, IProjectUserAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectUserAddCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserAddDto) {
        super(ProjectUserAddCommand.NAME, request);
    }
}

export interface IProjectUserAddDto {
    projectId: number;
}
export interface IProjectUserAddDtoResponse {
    project: UserProject;
}
