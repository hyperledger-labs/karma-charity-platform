import { Body, Controller, Param, Put, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil, ValidateUtil } from '@ts-core/common/util';
import { IUserEditDto, IUserEditDtoResponse } from '@project/common/platform/api/user';
import { User, UserPreferences, UserStatus, UserType } from '@project/common/platform/user';
import { RequestInvalidError } from '@project/module/core/middleware';
import { USER_URL } from '@project/common/platform/api';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class UserEditDto implements IUserEditDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(UserType)
    type?: UserType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDefined()
    preferences?: Partial<UserPreferences>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(`${USER_URL}/:id`)
export class UserEditController extends DefaultController<IUserEditDto, IUserEditDtoResponse> {
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

    @Swagger({ name: 'User edit', response: User })
    @Put()
    @UseGuards(UserGuard)
    public async executeExtended(@Param('id', ParseIntPipe) userId: number, @Body() params: UserEditDto, @Req() request: IUserHolder): Promise<IUserEditDtoResponse> {
        if (_.isNaN(userId)) {
            userId = request.user.id;
        }

        let user = request.user;
        let isAdministrator = request.user.type === UserType.ADMINISTRATOR;
        if (!isAdministrator) {
            if (!_.isNil(params.type)) {
                throw new RequestInvalidError({ name: 'type', value: params.type, expected: null });
            }
            if (!_.isNil(params.status)) {
                throw new RequestInvalidError({ name: 'status', value: params.status, expected: null });
            }
            if (user.id !== userId) {
                throw new RequestInvalidError({ name: 'id', value: userId, expected: user.id });
            }
        }

        if (isAdministrator) {
            if (user.id !== userId) {
                user = await this.database.user.findOneOrFail(userId);
            }
            if (!_.isNil(params.status)) {
                user.status = params.status;
            }
            if (!_.isNil(params.type)) {
                user.type = params.type;
            }
        }

        if (!_.isNil(params.preferences)) {
            let preferences = params.preferences;
            if (!_.isNil(preferences.birthday)) {
                preferences.birthday = new Date(preferences.birthday);
            }
            ObjectUtil.copyPartial(preferences, user.preferences);
        }

        user = await this.database.userSave(user);
        return user.toObject();
    }
}
