import { Injectable } from '@nestjs/common';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { CryptoService } from '../../service';
import { CryptoEncryptCommand, ICryptoEncryptDto } from '../CryptoEncryptCommand';

@Injectable()
export class CryptoEncryptHandler extends TransportCommandAsyncHandler<ICryptoEncryptDto, string, CryptoEncryptCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private service: CryptoService) {
        super(logger, transport, CryptoEncryptCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ICryptoEncryptDto): Promise<string> {
        return this.service.encrypt(params.type, params.value);
    }
}
