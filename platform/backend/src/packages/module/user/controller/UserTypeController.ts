import { Body, Controller, Param, Put, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { ExtendedError } from '@ts-core/common/error';
import { Logger } from '@ts-core/common/logger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil, TransformUtil, ValidateUtil } from '@ts-core/common/util';
import { IUserTypeDto, IUserTypeDtoResponse } from '@project/common/platform/api/user';
import { User, UserPreferences, UserStatus, UserType } from '@project/common/platform/user';
import { RequestInvalidError } from '@project/module/core/middleware';
import { USER_TYPE_URL } from '@project/common/platform/api';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class UserSetDto implements IUserTypeDto {
    @ApiProperty()
    @IsEnum(UserType)
    type: UserType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(USER_TYPE_URL)
export class UserTypeController extends DefaultController<IUserTypeDto, IUserTypeDtoResponse> {
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

    @Swagger({ name: 'User set type', response: User })
    @Put()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: UserType.UNDEFINED })
    public async executeExtended(@Body() params: UserSetDto, @Req() request: IUserHolder): Promise<IUserTypeDtoResponse> {
        let user = request.user;
        if (params.type !== UserType.COMPANY_MANAGER && params.type !== UserType.COMPANY_WORKER) {
            throw new RequestInvalidError({ name: 'type', value: params.type, expected: [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER] })
        }

        user.type = params.type;

        user = await this.database.userSave(user);
        return user.toObject();
    }
}
