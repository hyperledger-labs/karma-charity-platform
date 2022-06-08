import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { PaginableBookmark } from '@ts-core/common/dto';
import { CompanyListCommand, ICompanyListDto, ICompanyListDtoResponse } from '@project/common/transport/command/company';
import { TransformUtil } from '@ts-core/common/util';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class CompanyListHandler extends TransportCommandFabricAsyncHandler<ICompanyListDto, ICompanyListDtoResponse, CompanyListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
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
