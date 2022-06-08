import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { TransformUtil } from '@ts-core/common/util';
import { LedgerProject } from '@project/common/ledger/project';
import * as _ from 'lodash';
import { ProjectAddCommand, IProjectAddDto, ProjectAddDto } from '@project/common/transport/command/project';
import { UserGuard, IUserStubHolder, rolesCompanyCheck } from '@project/module/core/guard';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { ProjectService } from '../service/ProjectService';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { TransportCommandFabricAsyncHandler } from '@hlf-core/transport/chaincode/handler';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';
import { StubHolder } from '@hlf-core/transport/chaincode/stub';

@Injectable()
export class ProjectAddHandler extends TransportCommandFabricAsyncHandler<IProjectAddDto, LedgerProject, ProjectAddCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: TransportFabricChaincodeReceiver, private service: ProjectService) {
        super(logger, transport, ProjectAddCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    @UserGuard()
    protected async execute(params: IProjectAddDto, @StubHolder() holder: IUserStubHolder): Promise<LedgerProject> {
        await rolesCompanyCheck(holder, params.companyUid, LedgerCompanyRole.PROJECT_MANAGER);

        if (!(await holder.db.user.has(params.ownerUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find owner ${params.ownerUid}`);
        }
        if (!(await holder.db.company.has(params.companyUid))) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find company ${params.companyUid}`);
        }
        return this.service.add(holder, params);
    }

    protected checkRequest(request: IProjectAddDto): IProjectAddDto {
        return TransformUtil.toClass(ProjectAddDto, request);
    }

    protected checkResponse(response: LedgerProject): LedgerProject {
        return TransformUtil.fromClass(response);
    }
}
