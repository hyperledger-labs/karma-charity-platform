import { Body, Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { IUserHolder } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { FAVORITE_URL } from '@project/common/platform/api';
import { TransformGroup } from '@project/module/database';
import { IFavoriteRemoveDto } from '@project/common/platform/api/favorite';
import { Favorite, FavoriteObjectType, FavoriteStatus } from '@project/common/platform/favorite';
import { FavoriteEntity } from '@project/module/database/favorite';
import { FavoriteNotFoundError } from '@project/module/core/middleware';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class FavoriteRemoveDto implements IFavoriteRemoveDto {
    @ApiProperty()
    @IsNumber()
    objectId: number;

    @ApiProperty()
    @IsEnum(FavoriteObjectType)
    objectType: FavoriteObjectType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(FAVORITE_URL)
export class FavoriteRemoveController extends DefaultController<IFavoriteRemoveDto, void> {
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

    @Swagger({ name: 'Favorite remove', response: null })
    @Delete()
    @UseGuards(UserGuard)
    public async executeExtended(@Body() params: FavoriteRemoveDto, @Req() request: IUserHolder): Promise<void> {
        let item = await this.database.favorite.findOneBy({ userId: request.user.id, objectId: params.objectId, objectType: params.objectType });
        if (_.isNil(item)) {
            throw new FavoriteNotFoundError();
        }
        if (item.status === FavoriteStatus.NON_ACTIVE) {
            return;
        }
        item.status = FavoriteStatus.NON_ACTIVE;
        await this.database.favorite.save(item);
    }
}
