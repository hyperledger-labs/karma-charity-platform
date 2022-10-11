import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Paginable, FilterableConditionType, FilterableDataType } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { TypeormUtil } from '@ts-core/backend';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { PROJECT_CITY_URL } from '@project/common/platform/api';
import { IProjectCityListDto, IProjectCityListDtoResponse } from '@project/common/platform/api/project';
import { ProjectTag } from '@project/common/platform/project';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ProjectCityListDto implements IProjectCityListDto {
    @ApiProperty()
    @IsEnum(ProjectTag)
    tag: ProjectTag;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PROJECT_CITY_URL)
export class ProjectCityListController extends DefaultController<ProjectCityListDto, IProjectCityListDtoResponse> {
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

    @Swagger({ name: 'Get project city list', response: null })
    @Get()
    public async execute(@Query({ transform: Paginable.transform }) params: ProjectCityListDto): Promise<IProjectCityListDtoResponse> {
        let query = this.database.projectPreferences.createQueryBuilder().select('city');
        query = TypeormUtil.applyConditions(query, {
            tags: {
                condition: FilterableConditionType.INCLUDES_ONE_OF,
                value: [params.tag],
                type: FilterableDataType.ARRAY,
            }
        })
        
        let items = await query.distinct(true).getRawMany();
        return items.map(item => item.city).sort();
    }
}
