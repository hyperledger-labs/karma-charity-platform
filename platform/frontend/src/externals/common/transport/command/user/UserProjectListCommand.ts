import { TransformUtil } from '@ts-core/common';
import { KarmaLedgerCommand, KarmaTransportCommandAsync } from '../KarmaLedgerCommand';
import { IProjectListDto, IProjectListDtoResponse } from '../project';
import { LedgerProject } from '../../../ledger/project';

export class UserProjectListCommand extends KarmaTransportCommandAsync<IUserProjectListDto, IProjectListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerCommand.USER_PROJECT_LIST;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IUserProjectListDto) {
        super(UserProjectListCommand.NAME, request, null, true);
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

export interface IUserProjectListDto extends IProjectListDto {
    userUid: string;
}
