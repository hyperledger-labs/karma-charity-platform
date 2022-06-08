import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { ProjectListCommand, IProjectListDto, IProjectListDtoResponse } from '@project/common/transport/command/project';
import { PaginableBookmark } from '@ts-core/common/dto';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { TransformUtil } from '@ts-core/common/util';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectListHandler extends TransportCommandFabricAsyncHandler<IProjectListDto, IProjectListDtoResponse, ProjectListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, ProjectListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectListDto, @StubHolder() holder: IUserStubHolder): Promise<IProjectListDtoResponse> {
        return holder.db.project.findPaginated(params);
    }

    protected checkResponse(response: IProjectListDtoResponse): IProjectListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(params: IProjectListDto): IProjectListDto {
        return PaginableBookmark.transform(params);
    }
}
