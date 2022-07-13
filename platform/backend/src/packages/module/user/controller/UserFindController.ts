import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { UserNotFoundError } from '@project/module/core/middleware';;
import { User, UserType } from '@project/common/platform/user';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { IUserFindDtoResponse } from '@project/common/platform/api/user';
import { USER_FIND_URL } from '@project/common/platform/api';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${USER_FIND_URL}/:uid`)
export class UserFindController extends DefaultController<number, IUserFindDtoResponse> {
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

    @Swagger({ name: `Get user by uid`, response: User })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER]
    })
    public async executeExtends(@Param('uid') uid: string, @Req() request: IUserHolder): Promise<IUserFindDtoResponse> {
        let item = await this.database.userGet(uid);
        if (_.isNil(item)) {
            throw new UserNotFoundError();
        }
        return item.toObject();
    }


}
