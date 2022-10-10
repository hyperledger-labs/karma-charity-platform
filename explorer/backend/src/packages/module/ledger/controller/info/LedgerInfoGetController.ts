import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiProperty, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { IsDefined } from 'class-validator';
import { LedgerInfo } from '@hlf-explorer/common/ledger';
import { ILedgerInfoGetResponse, ILedgerInfoGetRequest } from '@hlf-explorer/common/api/info';
import * as _ from 'lodash';
import { ExtendedError } from '@ts-core/common/error';
import { TransformUtil } from '@ts-core/common/util';
import { Cache } from '@ts-core/backend-nestjs/cache';
import { LedgerApiMonitor } from '../../service/LedgerApiMonitor';
import { INFO_URL } from '@hlf-explorer/common/api';

// --------------------------------------------------------------------------
//
//  Dto
//
// ------------------------------------------I--------------------------------

export class LedgerInfoGetRequest implements ILedgerInfoGetRequest {
    @ApiProperty()
    @IsDefined()
    nameOrId: number | string;
}

export class LedgerInfoGetResponse implements ILedgerInfoGetResponse {
    @ApiProperty()
    @IsDefined()
    value: LedgerInfo;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(INFO_URL)
export class LedgerInfoGetController extends DefaultController<LedgerInfoGetRequest, LedgerInfoGetResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private monitor: LedgerApiMonitor, private cache: Cache) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    @ApiOperation({ summary: `Get ledger info by id` })
    @ApiOkResponse({ type: LedgerInfo })
    public async execute(@Query() params: LedgerInfoGetRequest): Promise<LedgerInfoGetResponse> {
        if (_.isNil(params.nameOrId)) {
            throw new ExtendedError(`Info name or id is nil`, HttpStatus.BAD_REQUEST);
        }

        /*
        let item = await this.cache.wrap<LedgerInfo>(this.getCacheKey(params), () => this.getItem(params), {
            ttl: DateUtil.MILISECONDS_SECOND / DateUtil.MILISECONDS_SECOND
        });
        */
        let item = await this.getItem(params);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find ledger info "${params.nameOrId}"`, HttpStatus.NOT_FOUND);
        }
        return { value: item };
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private getCacheKey(params: ILedgerInfoGetRequest): string {
        return `${params.nameOrId}:info`;
    }

    private async getItem(params: ILedgerInfoGetRequest): Promise<LedgerInfo> {
        let item = await this.monitor.getInfo(params.nameOrId);
        return !_.isNil(item) ? TransformUtil.fromClass(item) : null;
    }
}
