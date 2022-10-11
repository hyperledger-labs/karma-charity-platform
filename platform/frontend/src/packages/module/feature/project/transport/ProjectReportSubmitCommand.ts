import { UserProject } from '@project/common/platform/user';
import { TransportCommandAsync } from '@ts-core/common';

export class ProjectReportSubmitCommand extends TransportCommandAsync<IProjectReportSubmitDto, IProjectReportSubmitDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectReportSubmitCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectReportSubmitDto) {
        super(ProjectReportSubmitCommand.NAME, request);
    }
}

export type IProjectReportSubmitDto = UserProject;
export type IProjectReportSubmitDtoResponse = UserProject;
