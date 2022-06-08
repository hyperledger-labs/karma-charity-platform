import { Controller, Param, Req, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { ExtendedError } from '@ts-core/common/error';
import { TransformUtil } from '@ts-core/common/util';
import { DatabaseService } from '@project/module/database/service';
import { RequestInvalidError, UserNotFoundError } from '@project/module/core/middleware';;
import { User, UserType } from '@project/common/platform/user';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { IUserGetDtoResponse } from '@project/common/platform/api/user';
import { USER_URL } from '@project/common/platform/api';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${USER_URL}/:id`)
export class UserGetController extends DefaultController<number, IUserGetDtoResponse> {
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

    @Swagger({ name: `Get user by id`, response: User })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder): Promise<IUserGetDtoResponse> {
        // let item = await this.cache.wrap<LedgerBlock>(this.getCacheKey(params), () => this.getItem(params), {ttl: DateUtil.MILISECONDS_DAY / DateUtil.MILISECONDS_SECOND});

        if (request.user.type !== UserType.ADMINISTRATOR && request.user.id !== id) {
            throw new RequestInvalidError({ name: 'id', value: id, expected: request.user.id })
        }
        let item = await this.getItem(id);
        return item;
    }

    private async getItem(id: number): Promise<User> {
        let item = await this.database.userGet(id);
        if (_.isNil(item)) {
            throw new UserNotFoundError();
        }
        return item.toCompanyObject();
    }
}
