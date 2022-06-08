import { ProjectPurpose } from '@project/common/platform/project';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class ProjectPurposeAddCommand extends TransportCommandAsync<void, IProjectPurposeAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectPurposeAddCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super(ProjectPurposeAddCommand.NAME);
    }
}

export type IProjectPurposeAddDtoResponse = ProjectPurpose;
