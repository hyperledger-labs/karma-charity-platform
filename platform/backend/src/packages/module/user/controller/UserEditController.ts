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
import { TransformGroup } from '@project/module/database';

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
        let user = request.user;
        let item = await this.database.userGet(userId);

        let status = !user.isAdministrator ? [UserStatus.ACTIVE] : null;
        UserGuard.checkUser({ isRequired: true, status }, item);

        if (user.isAdministrator) {
            if (!_.isNil(params.status)) {
                user.status = params.status;
            }
            if (!_.isNil(params.type)) {
                user.type = params.type;
            }
        }
        else if (item.id !== user.id) {
            throw new RequestInvalidError({ name: 'id', value: userId, expected: user.id })
        }

        if (!_.isNil(params.preferences) && !_.isNil(params.preferences.birthday)) {
            params.preferences.birthday = new Date(params.preferences.birthday);
        }

        ObjectUtil.copyPartial(params.preferences, item.preferences);

        item = await this.database.user.save(item);
        return item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS, TransformGroup.PRIVATE] });
    }
}
