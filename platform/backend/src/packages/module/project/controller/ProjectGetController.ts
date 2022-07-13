import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { CompanyNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { PROJECT_URL } from '@project/common/platform/api';
import { UserCompany, UserProject } from '@project/common/platform/user';
import { IUserHolder } from '@project/module/database/user';
import { IProjectGetDtoResponse } from '@project/common/platform/api/project';
import { TransformGroup } from '@project/module/database';

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
    @UserGuardOptions({
        required: false
    })
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder): Promise<IProjectGetDtoResponse> {
        let user = request.user;
        
        let item = await this.database.projectGet(id, !_.isNil(user) ? user.id : null);
        UserGuard.checkProject({ isProjectRequired: true }, item);

        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
