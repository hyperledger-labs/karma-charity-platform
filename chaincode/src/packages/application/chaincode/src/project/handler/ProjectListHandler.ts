import { Injectable } from '@nestjs/common';
import { Logger, PaginableBookmark, TransformUtil, Transport } from '@ts-core/common';
import * as _ from 'lodash';
import { ProjectListCommand, IProjectListDto, IProjectListDtoResponse } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class ProjectListHandler extends TransportCommandFabricAsyncHandler<IProjectListDto, IProjectListDtoResponse, ProjectListCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
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
