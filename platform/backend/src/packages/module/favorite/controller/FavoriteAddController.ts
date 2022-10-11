import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
import { IFavoriteAddDto } from '@project/common/platform/api/favorite';
import { Favorite, FavoriteObjectType, FavoriteStatus } from '@project/common/platform/favorite';
import { FavoriteEntity } from '@project/module/database/favorite';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class FavoriteAddDto implements IFavoriteAddDto {
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
export class FavoriteAddController extends DefaultController<IFavoriteAddDto, void> {
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

    @Swagger({ name: 'Favorite add', response: Favorite })
    @Post()
    @UseGuards(UserGuard)
    public async executeExtended(@Body() params: FavoriteAddDto, @Req() request: IUserHolder): Promise<void> {
        let item = await this.database.favorite.findOneBy({ userId: request.user.id, objectId: params.objectId, objectType: params.objectType });
        if (!_.isNil(item)) {
            if (item.status !== FavoriteStatus.ACTIVE) {
                item.status = FavoriteStatus.ACTIVE;
                await this.database.favorite.save(item);
            }
            return;
        }

        item = new FavoriteEntity();
        item.status = FavoriteStatus.ACTIVE;

        item.user = request.user;
        item.objectId = params.objectId;
        item.objectType = params.objectType;

        switch (item.objectType) {
            case FavoriteObjectType.COMPANY:
                item.company = await this.database.company.findOneBy({ id: params.objectId });
                UserGuard.checkCompany({ isCompanyRequired: true }, item.company);
                break;
            case FavoriteObjectType.PROJECT:
                item.project = await this.database.project.findOneBy({ id: params.objectId });
                UserGuard.checkProject({ isProjectRequired: true }, item.project);
                break;
        }
        await this.database.favorite.save(item);
    }
}
