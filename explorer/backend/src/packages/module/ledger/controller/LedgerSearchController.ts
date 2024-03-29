import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiProperty, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { ExtendedError, Logger } from '@ts-core/common';
import { IsDefined, isUUID, IsString } from 'class-validator';
import { ILedgerSearchRequest, ILedgerSearchResponse, LedgerBlock, LedgerBlockTransaction, LedgerBlockEvent, SEARCH_URL, TRANSACTION_URL } from '@hlf-explorer/common';
import { Validator } from 'class-validator';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class LedgerSearchRequest implements ILedgerSearchRequest {
    @ApiProperty()
    @IsDefined()
    query: any;

    @ApiProperty()
    @IsString()
    ledgerName: string;
}

export class LedgerSearchResponse implements ILedgerSearchResponse {
    @ApiProperty()
    @IsDefined()
    value: LedgerBlock | LedgerBlockTransaction | LedgerBlockEvent;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(SEARCH_URL)
export class LedgerSearchController extends DefaultController<LedgerSearchRequest, LedgerSearchResponse> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private validator: Validator;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
        this.validator = new Validator();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Get()
    @ApiOperation({ summary: `Search ledger block, transaction or event` })
    @ApiOkResponse({ type: LedgerBlock })
    public async executeExtended(@Query() params: LedgerSearchRequest, @Res() response: any): Promise<LedgerSearchResponse> {
        let value = _.trim(params.query);
        if (_.isNil(value)) {
            throw new ExtendedError(`Query is nil`, HttpStatus.BAD_REQUEST);
        }
        let url = null;
        if (isUUID(value)) {
            url = `event?uid=${value}`;
        } else if (!_.isNaN(Number(value))) {
            url = `block?hashOrNumber=${value}`;
        } else {
            url = `transaction?hash=${value}`;
        }
        url = `${url}&ledgerName=${params.ledgerName}`;
        return response.redirect(url);
    }
}
