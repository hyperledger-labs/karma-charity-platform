import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { IsString } from 'class-validator';
import * as _ from 'lodash';
import { ApiProperty } from '@nestjs/swagger';
import { ILedgerResetRequest, RESET_URL } from '@hlf-explorer/common/api';
import { LedgerGuard, ILedgerHolder } from '../service/guard/LedgerGuard';
import { LedgerSettingsFactory } from '../service/LedgerSettingsFactory';
import { LedgerService } from '../service/LedgerService';
import { ExtendedError } from '@ts-core/common/error';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ResetDto implements ILedgerResetRequest {
    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    ledgerName: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(RESET_URL)
export class LedgerResetController extends DefaultController<ResetDto, any> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private settings: LedgerSettingsFactory, private service: LedgerService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Post()
    @UseGuards(LedgerGuard)
    public async executeExtended(@Body() params: ResetDto, @Req() holder: ILedgerHolder): Promise<any> {
        let name = holder.ledger.name;
        let settings = this.settings.get(name);
        if (_.isNil(settings) || _.isNil(settings.passwordToReset)) {
            throw new ExtendedError(`Method for "${params.ledgerName}" doesn't support`, ExtendedError.HTTP_CODE_METHOD_NOT_ALLOWED);
        }
        if (params.password !== settings.passwordToReset) {
            throw new ExtendedError(`Invalid password for "${params.ledgerName}"`, ExtendedError.HTTP_CODE_FORBIDDEN);
        }
        await this.service.ledgerReset(name);
    }
}
