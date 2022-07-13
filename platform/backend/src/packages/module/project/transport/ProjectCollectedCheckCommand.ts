import { TransportCommand } from '@ts-core/common/transport';

export class ProjectCollectedCheckCommand extends TransportCommand<IProjectCollectedCheckDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectCollectedCheckCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectCollectedCheckDto) {
        super(ProjectCollectedCheckCommand.NAME, request);

    }
}

export interface IProjectCollectedCheckDto {
    projectId: number;
    paymentId: number;
}
