import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { INIT_URL } from '@project/common/platform/api';
import { IInitDtoResponse } from '@project/common/platform/api/login';
import { User, UserRole } from '@project/common/platform/user';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { IsNotEmpty } from 'class-validator';
import { Swagger } from '@project/module/swagger';
import { IUserHolder } from '@project/module/database/user';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { DatabaseService } from '@project/module/database/service';
import { UserCompany } from '@project/common/platform/user';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class InitDtoResponse implements IInitDtoResponse {
    @ApiProperty()
    public user: User;

    @ApiPropertyOptional()
    public role?: UserRole;

    @ApiPropertyOptional()
    public company?: UserCompany;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(INIT_URL)
export class InitController extends DefaultController<void, IInitDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Get initialization details', response: InitDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        company: {
            required: false
        }
    })
    public async executeExtended(@Req() request: IUserHolder): Promise<InitDtoResponse> {
        let user = !_.isNil(request.user) ? request.user.toObject() : null;
        let company = !_.isNil(request.company) ? request.company.toUserObject() : null;
        return { user, company }
    }
}
