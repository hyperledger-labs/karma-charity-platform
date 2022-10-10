import { Injectable } from '@nestjs/common';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { Connection, Repository } from 'typeorm';
import { LedgerEntity } from '../ledger';
import { LedgerBlockEntity, LedgerBlockEventEntity, LedgerBlockTransactionEntity } from '../block';
import { Ledger } from '@hlf-explorer/common/ledger';
import * as _ from 'lodash';
import { ExtendedError } from '@ts-core/common/error';

@Injectable()
export class DatabaseService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private connection: Connection) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async ledgerSave(item: LedgerEntity): Promise<void> {
        await TypeormUtil.validateEntity(item);
        await this.ledger.save(item);
    }

    public async ledgerUpdate(item: Partial<Ledger>): Promise<void> {
        if (_.isNil(item) || _.isNil(item.id)) {
            throw new ExtendedError(`Params doesn't contain required properties`);
        }
        await TypeormUtil.validateEntity(item);

        let query = this.ledger
            .createQueryBuilder()
            .update(item)
            .where('id = :id', { id: item.id });

        if (!_.isNil(item.blockHeightParsed)) {
            query.andWhere('blockHeightParsed < :blockHeightParsed', { blockHeightParsed: item.blockHeightParsed });
        }

        await query.execute();
    }

    public async ledgerBlockSave(item: LedgerBlockEntity): Promise<void> {
        await TypeormUtil.validateEntity(item);
        await this.ledgerBlock.save(item);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public getConnection(): Connection {
        return this.connection;
    }

    public get ledger(): Repository<LedgerEntity> {
        return this.connection.getRepository(LedgerEntity);
    }

    public get ledgerBlock(): Repository<LedgerBlockEntity> {
        return this.connection.getRepository(LedgerBlockEntity);
    }

    public get ledgerBlockEvent(): Repository<LedgerBlockEventEntity> {
        return this.connection.getRepository(LedgerBlockEventEntity);
    }

    public get ledgerBlockTransaction(): Repository<LedgerBlockTransactionEntity> {
        return this.connection.getRepository(LedgerBlockTransactionEntity);
    }
}
