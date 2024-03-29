import { Controller, Get, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { ApiProperty, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger, TransformUtil, ExtendedError } from '@ts-core/common';
import { IsDefined, IsString } from 'class-validator';
import { BLOCK_URL, LedgerBlock, ILedgerBlockGetResponse, ILedgerBlockGetRequest } from '@hlf-explorer/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { LedgerGuard, ILedgerHolder } from '../../service/guard/LedgerGuard';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class LedgerBlockGetRequest implements ILedgerBlockGetRequest {
    @ApiProperty()
    @IsDefined()
    hashOrNumber: number | string;

    @ApiProperty()
    @IsString()
    ledgerName: string;
}

export class LedgerBlockGetResponse implements ILedgerBlockGetResponse {
    @ApiProperty()
    @IsDefined()
    value: LedgerBlock;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(BLOCK_URL)
export class LedgerBlockGetController extends DefaultController<LedgerBlockGetRequest, LedgerBlockGetResponse> {
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
    @ApiOperation({ summary: `Get ledger block by number or hash` })
    @ApiOkResponse({ type: LedgerBlock })
    @UseGuards(LedgerGuard)
    public async executeExtended(@Query() params: LedgerBlockGetRequest, @Req() holder: ILedgerHolder): Promise<LedgerBlockGetResponse> {
        if (_.isNil(params.hashOrNumber)) {
            throw new ExtendedError(`Block hash or number is nil`, HttpStatus.BAD_REQUEST);
        }
        /*
        let item = await this.cache.wrap<LedgerBlock>(this.getCacheKey(params), () => this.getItem(params), {
            ttl: DateUtil.MILLISECONDS_DAY / DateUtil.MILLISECONDS_SECOND
        });
        */
        let item = await this.getItem(params, holder.ledger.id);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find block "${params.hashOrNumber}" hash or number`, HttpStatus.NOT_FOUND);
        }

        return { value: item };
    }

    private async getItem(params: ILedgerBlockGetRequest, ledgerId: number): Promise<LedgerBlock> {
        let conditions = { ledgerId } as Partial<LedgerBlock>;
        if (!_.isNaN(Number(params.hashOrNumber))) {
            conditions.number = Number(params.hashOrNumber);
        } else {
            conditions.hash = params.hashOrNumber.toString();
        }
        let item = await this.database.ledgerBlock.findOneBy(conditions);
        return !_.isNil(item) ? TransformUtil.fromClass(item) : null;
    }
}
