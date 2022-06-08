import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { CompanyNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { COMPANY_URL, USER_URL } from '@project/common/platform/api';
import { UserCompany } from '@project/common/platform/user';
import { IUserHolder } from '@project/module/database/user';
import { ICompanyGetDtoResponse } from '@project/common/platform/api/company';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${COMPANY_URL}/:id`)
export class CompanyGetController extends DefaultController<number, ICompanyGetDtoResponse> {
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

    @Swagger({ name: `Get user by id`, response: UserCompany })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder,): Promise<ICompanyGetDtoResponse> {
        // let item = await this.cache.wrap<LedgerBlock>(this.getCacheKey(params), () => this.getItem(params), {ttl: DateUtil.MILISECONDS_DAY / DateUtil.MILISECONDS_SECOND});

        let item = await this.getItem(id, request.user.id);
        return item;
    }

    private async getItem(id: number, userId: number): Promise<UserCompany> {
        let item = await this.database.companyGet(id, userId);
        if (_.isNil(item)) {
            throw new CompanyNotFoundError();
        }
        return item.toUserObject();
    }
}
