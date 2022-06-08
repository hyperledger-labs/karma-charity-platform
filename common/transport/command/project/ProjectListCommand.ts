import { ITraceable } from '@ts-core/common/trace';
import { IPaginationBookmark, PaginableBookmark } from '@ts-core/common/dto';
import { TransformUtil } from '@ts-core/common/util';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { LedgerProject } from '../../../ledger/project';

export class ProjectListCommand extends KarmaTransportCommandAsync<IProjectListDto, IProjectListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.PROJECT_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IProjectListDto) {
        super(ProjectListCommand.NAME, request, null, true);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkResponse(response: IProjectListDtoResponse): IProjectListDtoResponse {
        response.items = TransformUtil.toClassMany(LedgerProject, response.items);
        return response;
    }
}

export interface IProjectListDto extends PaginableBookmark<LedgerProject>, ITraceable {}
export interface IProjectListDtoResponse extends IPaginationBookmark<LedgerProject> {}
