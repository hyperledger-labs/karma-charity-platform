import { Controller, Get, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { ApiProperty, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { IsDefined, IsString } from 'class-validator';
import { LedgerBlock, LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { ILedgerBlockTransactionGetResponse, ILedgerBlockTransactionGetRequest } from '@hlf-explorer/common/api/transaction';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { ExtendedError } from '@ts-core/common/error';
import { TransformUtil } from '@ts-core/common/util';
import { LedgerGuard, ILedgerHolder } from '../../service/guard/LedgerGuard';
import { TRANSACTION_URL } from '@hlf-explorer/common/api';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class LedgerBlockTransactionGetRequest implements ILedgerBlockTransactionGetRequest {
    @ApiProperty()
    @IsString()
    hash: string;

    @ApiProperty()
    @IsString()
    ledgerName: string;
}

export class LedgerBlockTransactionGetResponse implements ILedgerBlockTransactionGetResponse {
    @ApiProperty()
    @IsDefined()
    value: LedgerBlockTransaction;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(TRANSACTION_URL)
export class LedgerBlockTransactionGetController extends DefaultController<
LedgerBlockTransactionGetRequest,
LedgerBlockTransactionGetResponse
> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    @ApiOperation({ summary: `Get block transaction by hash` })
    @ApiOkResponse({ type: LedgerBlock })
    @UseGuards(LedgerGuard)
    public async executeExtended(
        @Query() params: LedgerBlockTransactionGetRequest,
        @Req() holder: ILedgerHolder
    ): Promise<LedgerBlockTransactionGetResponse> {
        if (_.isNil(params.hash)) {
            throw new ExtendedError(`Block hash is nil`, HttpStatus.BAD_REQUEST);
        }
        /*
        let item = await this.cache.wrap<LedgerBlockTransaction>(this.getCacheKey(params), () => this.getItem(params), {
            ttl: DateUtil.MILISECONDS_DAY / DateUtil.MILISECONDS_SECOND
        });
        */

        let item = await this.getItem(params, holder.ledger.id);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find transaction "${params.hash}" hash`, HttpStatus.NOT_FOUND);
        }

        return { value: item };
    }

    private async getItem(params: ILedgerBlockTransactionGetRequest, ledgerId: number): Promise<LedgerBlockTransaction> {
        let conditions = { hash: params.hash, ledgerId };
        let item = await this.database.ledgerBlockTransaction.findOne(conditions);
        return !_.isNil(item) ? TransformUtil.fromClass(item) : null;
    }
}
