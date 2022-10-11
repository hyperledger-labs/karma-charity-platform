import { Controller, Param, Req, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { ExtendedError } from '@ts-core/common';
import { TransformUtil } from '@ts-core/common';
import { DatabaseService } from '@project/module/database/service';
import { RequestInvalidError, UserNotFoundError } from '@project/module/core/middleware';;
import { User, UserType } from '@project/common/platform/user';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { IUserGetDtoResponse } from '@project/common/platform/api/user';
import { USER_URL } from '@project/common/platform/api';
import { TransformGroup } from '@project/module/database';

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
        let user = request.user;

        let item = await this.database.userGet(id);
        UserGuard.checkUser({ isRequired: true }, item)

        let groups = [TransformGroup.PUBLIC_DETAILS];
        if (item.id === user.id) {
            groups.push(TransformGroup.PRIVATE);
        }
        return item.toObject({ groups });
    }
}
