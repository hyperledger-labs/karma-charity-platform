import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { TransformUtil, Logger, FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import { INFOS_URL, LedgerInfo } from '@hlf-explorer/common';
import { DatabaseService } from '@project/module/database/service';
import * as _ from 'lodash';
import { LedgerEntity } from '@project/module/database/ledger';
import { LedgerApiMonitor } from '../../service/LedgerApiMonitor';
import { LedgerGuardPaginable } from '../../service/guard/LedgerGuardPaginable';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class LedgerInfoListDto implements Paginable<LedgerInfo> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<LedgerInfo>;

    @ApiPropertyOptional()
    sort?: FilterableSort<LedgerInfo>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class LedgerInfoListDtoResponse implements IPagination<LedgerInfo> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: LedgerInfo })
    items: Array<LedgerInfo>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(INFOS_URL)
export class LedgerInfoListController extends DefaultController<LedgerInfoListDto, LedgerInfoListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private monitor: LedgerApiMonitor, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    @ApiOperation({ summary: `Ledger info list` })
    @ApiOkResponse({ type: LedgerInfoListDtoResponse })
    @UseGuards(LedgerGuardPaginable)
    public async executeExtended(@Query({ transform: Paginable.transform }) params: LedgerInfoListDto): Promise<LedgerInfoListDtoResponse> {
        return TypeormUtil.toPagination(this.database.ledger.createQueryBuilder('item'), params, this.transform);
    }

    protected transform = async (value: LedgerEntity): Promise<LedgerInfo> => {
        return TransformUtil.fromClass(await this.monitor.getInfo(value.id));
    };
}
