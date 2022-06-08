import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { CompanyNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { PROJECT_URL } from '@project/common/platform/api';
import { UserCompany, UserProject } from '@project/common/platform/user';
import { IUserHolder } from '@project/module/database/user';
import { IProjectGetDtoResponse } from '@project/common/platform/api/project';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${PROJECT_URL}/:id`)
export class ProjectGetController extends DefaultController<number, IProjectGetDtoResponse> {
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
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder,): Promise<IProjectGetDtoResponse> {
        // let item = await this.cache.wrap<LedgerBlock>(this.getCacheKey(params), () => this.getItem(params), {ttl: DateUtil.MILISECONDS_DAY / DateUtil.MILISECONDS_SECOND});

        let item = await this.getItem(id, request.user.id);
        return item;
    }

    private async getItem(id: number, userId: number): Promise<UserProject> {
        let item = await this.database.projectGet(id, userId);
        if (_.isNil(item)) {
            throw new CompanyNotFoundError();
        }
        return item.toUserObject();
    }
}
