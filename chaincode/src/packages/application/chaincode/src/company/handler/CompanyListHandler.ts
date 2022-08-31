import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { PaginableBookmark } from '@ts-core/common';
import { CompanyListCommand, ICompanyListDto, ICompanyListDtoResponse } from '@project/common/transport/command/company';
import { TransformUtil } from '@ts-core/common';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyListHandler extends TransportCommandFabricAsyncHandler<ICompanyListDto, ICompanyListDtoResponse, CompanyListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: ICompanyListDto, @StubHolder() holder: IUserStubHolder): Promise<ICompanyListDtoResponse> {
        return holder.db.company.findPaginated(params);
    }

    protected checkResponse(response: ICompanyListDtoResponse): ICompanyListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: ICompanyListDto): ICompanyListDto {
        return PaginableBookmark.transform(request);
    }
}
