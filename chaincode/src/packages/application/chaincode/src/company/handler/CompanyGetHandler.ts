import { Injectable } from '@nestjs/common';
import { Logger, Transport } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { CompanyGetCommand, ICompanyGetDto } from '@project/common/transport/command/company';
import { UserGuard, IUserStubHolder } from '@project/module/core/guard';
import { LedgerCompany } from '@project/common/ledger/company';
import { LedgerError, LedgerErrorCode } from '@project/common/ledger/error';
import { StubHolder, TransportCommandFabricAsyncHandler } from '@hlf-core/transport-chaincode';

@Injectable()
export class CompanyGetHandler extends TransportCommandFabricAsyncHandler<ICompanyGetDto, LedgerCompany, CompanyGetCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport) {
        super(logger, transport, CompanyGetCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private MethodsU
    //
    // --------------------------------------------------------------------------

    @UserGuard({ isNeedCheck: false })
    protected async execute(params: ICompanyGetDto, @StubHolder() holder: IUserStubHolder): Promise<LedgerCompany> {
        let item = await holder.db.company.get(params.uid, params.details);
        if (_.isNil(item)) {
            throw new LedgerError(LedgerErrorCode.NOT_FOUND, `Unable to find company "${params.uid}"`);
        }
        return item;
    }

    protected checkResponse(response: LedgerCompany): LedgerCompany {
        return TransformUtil.fromClass(response);
    }
}
