import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { DatabaseService } from '@project/module/database/service';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { LedgerBlockEventEntity } from '@project/module/database/block';
import { LedgerGuardPaginable } from '../../service/guard/LedgerGuardPaginable';
import { EVENTS_URL } from '@hlf-explorer/common/api';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class LedgerBlockEventListDto implements Paginable<LedgerBlockEvent> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<LedgerBlockEvent>;

    @ApiPropertyOptional()
    sort?: FilterableSort<LedgerBlockEvent>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class LedgerBlockEventListDtoResponse implements IPagination<LedgerBlockEvent> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: LedgerBlockEvent })
    items: Array<LedgerBlockEvent>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(EVENTS_URL)
export class LedgerBlockEventListController extends DefaultController<LedgerBlockEventListDto, LedgerBlockEventListDtoResponse> {
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
    @ApiOperation({ summary: `Ledger events list` })
    @ApiOkResponse({ type: LedgerBlockEventListDtoResponse })
    @UseGuards(LedgerGuardPaginable)
    public async executeExtended(
        @Query({ transform: Paginable.transform }) params: LedgerBlockEventListDto
    ): Promise<LedgerBlockEventListDtoResponse> {
        let query = this.database.ledgerBlockEvent.createQueryBuilder('item');
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (value: LedgerBlockEventEntity): Promise<LedgerBlockEvent> => {
        let item = TransformUtil.fromClass(value);
        item.rawData = null;
        return item;
    };
}
