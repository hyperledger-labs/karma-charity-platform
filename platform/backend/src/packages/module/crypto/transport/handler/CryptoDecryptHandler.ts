import { Logger } from '@ts-core/common/logger';
import { Injectable } from '@nestjs/common';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CryptoDecryptCommand, ICryptoDecryptDto } from '../CryptoDecryptCommand';
import { CryptoService } from '../../service';

@Injectable()
export class CryptoDecryptHandler extends TransportCommandAsyncHandler<ICryptoDecryptDto, string, CryptoDecryptCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CryptoService) {
        super(logger, transport, CryptoDecryptCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICryptoDecryptDto): Promise<string> {
        return this.service.decrypt(params.type, params.value);
    }
}
