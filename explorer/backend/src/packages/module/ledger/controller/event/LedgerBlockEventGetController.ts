import { Controller, Get, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { ApiProperty, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DefaultController, Cache } from '@ts-core/backend-nestjs';
import { Logger, ExtendedError, TransformUtil } from '@ts-core/common';
import { IsString, IsDefined } from 'class-validator';
import { EVENT_URL, LedgerBlock, LedgerBlockEvent, ILedgerBlockEventGetResponse, ILedgerBlockEventGetRequest } from '@hlf-explorer/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { IsUUID } from 'class-validator';
import { LedgerGuard, ILedgerHolder } from '../../service/guard/LedgerGuard';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class LedgerBlockEventGetRequest implements ILedgerBlockEventGetRequest {
    @ApiProperty()
    @IsUUID()
    uid: string;

    @ApiProperty()
    @IsString()
    ledgerName: string;
}

export class LedgerBlockEventGetResponse implements ILedgerBlockEventGetResponse {
    @ApiProperty()
    @IsDefined()
    value: LedgerBlockEvent;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(EVENT_URL)
export class LedgerBlockEventGetController extends DefaultController<LedgerBlockEventGetRequest, LedgerBlockEventGetResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private cache: Cache) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    @ApiOperation({ summary: `Get block event by uid` })
    @ApiOkResponse({ type: LedgerBlock })
    @UseGuards(LedgerGuard)
    public async executeExtended(
        @Query() params: LedgerBlockEventGetRequest,
        @Req() holder: ILedgerHolder
    ): Promise<LedgerBlockEventGetResponse> {
        /*
        let item = await this.cache.wrap<LedgerBlockEvent>(this.getCacheKey(params), () => this.getItem(params), {
            ttl: DateUtil.MILLISECONDS_DAY / DateUtil.MILLISECONDS_SECOND
        });
        */
        let item = await this.getItem(params, holder.ledger.id);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find event "${params.uid}" uid`, HttpStatus.NOT_FOUND);
        }
        return { value: item };
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private getCacheKey(params: ILedgerBlockEventGetRequest): string {
        return `${params.ledgerName}:event:${params.uid}`;
    }

    private async getItem(params: ILedgerBlockEventGetRequest, ledgerId: number): Promise<LedgerBlockEvent> {
        let conditions = { uid: params.uid, ledgerId } as Partial<LedgerBlockEvent>;
        let item = await this.database.ledgerBlockEvent.findOneBy(conditions);
        return !_.isNil(item) ? TransformUtil.fromClass(item) : null;
    }
}
