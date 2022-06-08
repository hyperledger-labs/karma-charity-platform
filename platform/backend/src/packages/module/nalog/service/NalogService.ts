import { Injectable } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { INalogObject } from '@project/common/platform/api/nalog';
import { NalogClient } from './NalogClient';

@Injectable()
export class NalogService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private client: NalogClient;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
        this.client = new NalogClient(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async search(query: string): Promise<Array<INalogObject>> {
        return this.client.search(query);
    }

}