import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommand, TransportCommandAsync, TransportCommandHandler } from '@ts-core/common/transport';
import { DatabaseService } from '@project/module/database/service';
import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import { ILedgerBatchDto, LedgerBatchCommand } from '../transport/command/LedgerBatchCommand';
import { LedgerTransportFactory } from '../service/LedgerTransportFactory';
import { LedgerSettingsFactory } from '../service/LedgerSettingsFactory';
import { ITransportCryptoManager, TransportCryptoManagerEd25519 } from '@ts-core/common/transport/crypto';
import { TRANSPORT_FABRIC_COMMAND_BATCH_NAME } from '@hlf-core/transport';

@Injectable()
export class LedgerBatchHandler extends TransportCommandHandler<ILedgerBatchDto, LedgerBatchCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        logger: Logger,
        transport: Transport,
        private database: DatabaseService,
        private factory: LedgerTransportFactory,
        private settings: LedgerSettingsFactory
    ) {
        super(logger, transport, LedgerBatchCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ILedgerBatchDto): Promise<void> {
        let settings = this.settings.getById(params.ledgerId);
        if (_.isNil(settings.batch) || _.isBoolean(settings.batch)) {
            return;
        }

        let api = await this.factory.get(params.ledgerId);
        let manager = new TransportCryptoManagerEd25519();

        let command = new TransportCommandAsync(TRANSPORT_FABRIC_COMMAND_BATCH_NAME);
        api.send(command, { signature: await TransportCommand.sign(command, manager, settings.batch.key) });
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private getManager(algorithm: string): ITransportCryptoManager {
        if (algorithm !== TransportCryptoManagerEd25519.ALGORITHM) {
            throw new ExtendedError(`Unable to find crypto manager for "${algorithm}" algorithm`);
        }
        return new TransportCryptoManagerEd25519();
    }
}
