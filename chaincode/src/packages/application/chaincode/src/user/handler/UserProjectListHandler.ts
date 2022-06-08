import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { PaginableBookmark } from '@ts-core/common/dto';
import { UserProjectListCommand, IUserProjectListDto } from '@project/common/transport/command/user';
import { TransformUtil } from '@ts-core/common/util';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { IProjectListDtoResponse } from '@project/common/transport/command/project';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class UserProjectListHandler extends TransportCommandFabricAsyncHandler<
    IUserProjectListDto,
    IProjectListDtoResponse,
    UserProjectListCommand
> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver) {
        super(logger, transport, UserProjectListCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IUserProjectListDto, @StubHolder() holder: IUserStubHolder): Promise<IProjectListDtoResponse> {
        return holder.db.user.projectList(params.userUid, params);
    }

    protected checkResponse(response: IProjectListDtoResponse): IProjectListDtoResponse {
        response.items = TransformUtil.fromClassMany(response.items);
        return response;
    }

    protected checkRequest(request: IUserProjectListDto): IUserProjectListDto {
        return PaginableBookmark.transform(request) as IUserProjectListDto;
    }
}
