import { UserProject } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common';

export class ProjectUserRoleEditCommand extends TransportCommandAsync<IProjectUserRoleEditDto, IProjectUserRoleEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectUserRoleEditCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectUserRoleEditDto) {
        super(ProjectUserRoleEditCommand.NAME, request);
    }
}

export interface IProjectUserRoleEditDto {
    userId: number;
    projectId: number;
}
export interface IProjectUserRoleEditDtoResponse {
    project: UserProject;
}
