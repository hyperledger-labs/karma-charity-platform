import { Injectable } from '@nestjs/common';
import { Logger, PaginableBookmark, TransformUtil, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyProjectListCommand, ICompanyProjectListDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IProjectListDtoResponse } from '@project/common/transport/command/project';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyProjectListHandler extends TransportCommandFabricAsyncHandler<ICompanyProjectListDto, IProjectListDtoResponse, CompanyProjectListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyProjectListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyProjectListDto, @StubHolder() holder: IUserStubHolder): Promise<IProjectListDtoResponse> {
        return holder.db.company.projectList(params.companyUid, params);
    }

    protected checkResponse(response: IProjectListDtoResponse): IProjectListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: ICompanyProjectListDto): ICompanyProjectListDto {
        return PaginableBookmark.transform(request) as ICompanyProjectListDto;
    }
}
