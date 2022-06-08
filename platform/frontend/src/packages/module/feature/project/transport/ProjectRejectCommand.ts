import { Project } from '@project/common/platform/project';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectRejectCommand extends TransportCommandAsync<IProjectRejectDto, IProjectRejectDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectRejectCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectRejectDto) {
        super(ProjectRejectCommand.NAME, request);
    }
}

export type IProjectRejectDto = Project;
export type IProjectRejectDtoResponse = Project;
