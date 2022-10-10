import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { IsObject, IsOptional, IsString, IsBoolean } from 'class-validator';
import * as _ from 'lodash';
import { ApiProperty } from '@nestjs/swagger';
import { LedgerTransportFactory } from '../service/LedgerTransportFactory';
import { ILedgerRequestRequest, REQUEST_URL } from '@hlf-explorer/common/api';
import { ITransportCommand, ITransportCommandOptions, TransportCommandAsync, TransportCommand } from '@ts-core/common/transport';
import { TransformUtil } from '@ts-core/common/util';
import { LedgerGuard, ILedgerHolder } from '../service/guard/LedgerGuard';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class RequestDto<U = any> implements ILedgerRequestRequest<U> {
    @ApiProperty()
    @IsObject()
    request: ITransportCommand<U>;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    options?: ITransportCommandOptions;

    @ApiProperty()
    @IsBoolean()
    isAsync: boolean;

    @ApiProperty()
    @IsString()
    ledgerName: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(REQUEST_URL)
export class LedgerRequestController extends DefaultController<RequestDto, any> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private factory: LedgerTransportFactory) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Post()
    @UseGuards(LedgerGuard)
    public async executeExtended<U>(@Body() params: RequestDto<U>, @Req() holder: ILedgerHolder): Promise<any> {
        let transport = await this.factory.get(holder.ledger.id);
        if (params.isAsync) {
            return transport.sendListen(TransformUtil.toClass(TransportCommandAsync, params.request), params.options);
        } else {
            transport.send(TransformUtil.toClass(TransportCommand, params.request), params.options);
        }
    }
}
