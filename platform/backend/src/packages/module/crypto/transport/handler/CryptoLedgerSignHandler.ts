import { Injectable } from '@nestjs/common';
import { ExtendedError } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { TransportCommand } from '@ts-core/common';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common';
import * as _ from 'lodash';
import { CryptoLedgerSignCommand, ICryptoLedgerSignDto } from '../CryptoLedgerSignCommand';
import { ISignature } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { CryptoService } from '../../service';
import { CryptoDecryptCommand } from '../CryptoDecryptCommand';
import { CryptoKeyType } from '@project/common/platform/crypto';


@Injectable()
export class CryptoLedgerSignHandler extends TransportCommandAsyncHandler<ICryptoLedgerSignDto, ISignature, CryptoLedgerSignCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService, private service: CryptoService) {
        super(logger, transport, CryptoLedgerSignCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICryptoLedgerSignDto): Promise<ISignature> {
        let user = await this.database.user.findOneBy({ ledgerUid: params.uid } as any);
        if (_.isNil(user)) {
            throw new ExtendedError(`Unable to ledger sign: can't find user by "${params.uid}" uid`);
        }
        let key = user.cryptoKey;
        let manager = this.service.managers.get(key.algorithm);
        if (_.isNil(manager)) {
            throw new ExtendedError(`Unable to ledger sign: can't sign manager for "${key.algorithm}" algorithm`);
        }
        if (!params.isDisableDecryption) {
            key.privateKey = await this.transport.sendListen(new CryptoDecryptCommand({ type: CryptoKeyType.DATABASE, value: key.privateKey }));
        }
        return TransportCommand.sign(params.command, manager, key);
    }
}
