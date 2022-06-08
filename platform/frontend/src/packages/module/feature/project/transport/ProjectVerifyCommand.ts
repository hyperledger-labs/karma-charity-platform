import { Project } from '@project/common/platform/project';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectVerifyCommand extends TransportCommandAsync<IProjectVerifyDto, IProjectVerifyDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectVerifyCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectVerifyDto) {
        super(ProjectVerifyCommand.NAME, request);
    }
}

export type IProjectVerifyDto = Project;
export type IProjectVerifyDtoResponse = Project;
