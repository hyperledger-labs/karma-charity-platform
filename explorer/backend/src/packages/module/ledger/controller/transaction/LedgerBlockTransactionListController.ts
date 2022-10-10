import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { DatabaseService } from '@project/module/database/service';
import { TransformUtil } from '@ts-core/common/util';
import { LedgerService } from '../../service/LedgerService';
import * as _ from 'lodash';
import { LedgerBlockTransactionEntity } from '@project/module/database/block';
import { LedgerGuardPaginable } from '../../service/guard/LedgerGuardPaginable';
import { TRANSACTIONS_URL } from '@hlf-explorer/common/api';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class LedgerBlockTransactionListDto implements Paginable<LedgerBlockTransaction> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<LedgerBlockTransaction>;

    @ApiPropertyOptional()
    sort?: FilterableSort<LedgerBlockTransaction>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class LedgerBlockTransactionListDtoResponse implements IPagination<LedgerBlockTransaction> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: LedgerBlockTransaction })
    items: Array<LedgerBlockTransaction>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(TRANSACTIONS_URL)
export class LedgerBlockTransactionListController extends DefaultController<
    LedgerBlockTransactionListDto,
    LedgerBlockTransactionListDtoResponse
> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private service: LedgerService, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    @ApiOperation({ summary: `Ledger transactions list` })
    @ApiOkResponse({ type: LedgerBlockTransactionListDtoResponse })
    @UseGuards(LedgerGuardPaginable)
    public async executeExtended(
        @Query({ transform: Paginable.transform }) params: LedgerBlockTransactionListDto
    ): Promise<LedgerBlockTransactionListDtoResponse> {
        let query = this.database.ledgerBlockTransaction.createQueryBuilder('item');
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (value: LedgerBlockTransactionEntity): Promise<LedgerBlockTransaction> => {
        let item = TransformUtil.fromClass(value);
        item.rawData = null;
        return item;
    };
}
