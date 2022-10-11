import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_CHANGE_URL } from '@project/common/platform/api';
import { IPasswordChangeDto } from '@project/common/platform/api/login';
import { UserResource } from '@project/common/platform/user';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { IsString } from 'class-validator';
import { Swagger } from '@project/module/swagger';
import { IUserHolder } from '@project/module/database/user';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import * as _ from 'lodash';
import { PasswordStrategy } from '../strategy';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class PasswordChangeDto implements IPasswordChangeDto {
    @ApiProperty()
    @IsString()
    public old: string;

    @ApiProperty()
    @IsString()
    public new: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PASSWORD_CHANGE_URL)
export class PasswordChangeController extends DefaultController<IPasswordChangeDto, void> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private password: PasswordStrategy) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Change user password', response: null })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ resource: UserResource.PASSWORD })
    public async executeExtended(@Body() params: PasswordChangeDto, @Req() request: IUserHolder): Promise<void> {
        await this.password.passwordChange(request.user, params.old, params.new);
    }
}
