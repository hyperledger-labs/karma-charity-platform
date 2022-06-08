import { IProjectEditDtoResponse } from '@project/common/platform/api/project';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectEditCommand extends TransportCommandAsync<number, IProjectEditDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectEditCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: number) {
        super(ProjectEditCommand.NAME, request);
    }
}
