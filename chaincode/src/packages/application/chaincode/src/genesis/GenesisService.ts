import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserService } from '../user/service/UserService';
import { IGenesis } from '@project/common/ledger';
import { ChaincodeStub } from 'fabric-shim';
import { IUserStubHolder, DBManager } from '@project/module/core/guard';
import { LedgerRole } from '@project/common/ledger/role';
import { LedgerUser } from '@project/common/ledger/user';
import { CompanyService } from '../company/service/CompanyService';
import { TransformUtil } from '@ts-core/common/util';
import { ROOT_USER_CRYPTO_ALGORITHM, ROOT_COMPANY_DESCRIPTION, ROOT_USER_CRYPTO_KEY_PUBLIC, ROOT_USER_DESCRIPTION } from '@project/common/ledger';
import { Genesis } from '@project/common/transport/command';
import { ITransportFabricStub, TransportFabricStub } from '@hlf-core/transport/chaincode/stub';
import { TransportFabricChaincodeReceiver } from '@hlf-core/transport/chaincode';

@Injectable()
export class GenesisService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    private static KEY = 'GENESIS';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        logger: Logger,
        private user: UserService,
        private company: CompanyService,
        private chaincode: TransportFabricChaincodeReceiver
    ) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private holderGet(stub: ChaincodeStub): IUserStubHolder {
        let transport = this.stubGet(stub);

        let db = new DBManager(this.logger, transport);
        let destroy = () => db.destroy();

        return {
            id: null,
            name: null,
            stub: transport,
            user: LedgerUser.createRoot(),
            db,
            destroy
        };
    }

    private stubGet(stub: ChaincodeStub): TransportFabricStub {
        return new TransportFabricStub(
            stub,
            null,
            { userId: LedgerUser.createRoot().uid, signature: { nonce: null, value: null, algorithm: null, publicKey: null } },
            this.chaincode
        );
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async get(stub: ChaincodeStub | ITransportFabricStub): Promise<IGenesis> {
        if (stub instanceof ChaincodeStub) {
            stub = this.stubGet(stub);
        }
        return stub.getState<IGenesis>(GenesisService.KEY);
    }

    public async add(stub: ChaincodeStub): Promise<IGenesis> {
        let holder = this.holderGet(stub);

        // Add root user
        let user = await this.user.add(
            holder,
            {
                roles: Object.values(LedgerRole),
                description: ROOT_USER_DESCRIPTION,
                cryptoKey: { value: ROOT_USER_CRYPTO_KEY_PUBLIC, algorithm: ROOT_USER_CRYPTO_ALGORITHM }
            },
            true
        );
        // Add root company
        let company = await this.company.add(holder, { description: ROOT_COMPANY_DESCRIPTION, ownerUid: user.uid }, true);
        // Save genesis information
        return holder.stub.putState<IGenesis>(
            GenesisService.KEY,
            TransformUtil.toClass(Genesis, {
                rootUserUid: user.uid,
                rootCompanyUid: company.uid,
                createdDate: holder.stub.transactionDate
            }),
            true,
            true
        );
    }
}
