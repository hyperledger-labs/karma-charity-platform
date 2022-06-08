import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { NALOG_SERACH_URL } from '@project/common/platform/api';
import { INalogSearchDtoResponse } from '@project/common/platform/api/nalog';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { NalogService } from '../service';
import { UserType } from '@project/common/platform/user';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${NALOG_SERACH_URL}/:value`)
export class NalogSearchController extends DefaultController<string, INalogSearchDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private service: NalogService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Search object in nalog.ru', response: null })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: UserType.COMPANY_MANAGER })
    public async execute(@Param('value') value: string): Promise<INalogSearchDtoResponse> {
        let item = await this.service.search(value);
        return item;
    }
}
