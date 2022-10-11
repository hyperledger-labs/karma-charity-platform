import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { PROJECT_TAG_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { IProjectTagListDto, IProjectTagListDtoResponse } from '@project/common/platform/api/project';
import { ProjectTag } from '@project/common/platform/project';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ProjectTagListDto implements IProjectTagListDto {
    @ApiProperty()
    @IsString()
    city: string;

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

@Controller(PROJECT_TAG_URL)
export class ProjectTagListController extends DefaultController<ProjectTagListDto, IProjectTagListDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    private static TAGS = [ProjectTag.CHILDREN, ProjectTag.ADULT, ProjectTag.AGED, ProjectTag.ANIMAL, ProjectTag.CULTURE, ProjectTag.NATURE];

    private static sortFunction(first: ProjectTag, second: ProjectTag): number {
        let firstIndex = ProjectTagListController.TAGS.indexOf(first);
        let secondIndex = ProjectTagListController.TAGS.indexOf(second);
        if (firstIndex === -1 && secondIndex !== -1) {
            return 1;
        }
        if (secondIndex === -1 && firstIndex !== -1) {
            return -1;
        }
        return firstIndex === secondIndex ? 0 : firstIndex < secondIndex ? -1 : 1;

    }

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

    @Swagger({ name: 'Get project tag list', response: null })
    @Get()
    public async execute(@Query({ transform: Paginable.transform }) params: ProjectTagListDto): Promise<IProjectTagListDtoResponse> {
        let items = await this.database.projectPreferences.createQueryBuilder('projectPreferences')
            .select('projectPreferences.tags', 'tags')
            .where(`projectPreferences.city = :city`, { city: params.city })
            .distinct(true)
            .getRawMany();

        let tags = new Array();
        items.forEach(item => tags.push(...item.tags));
        tags = _.uniq(tags);
        return tags.sort(ProjectTagListController.sortFunction);
    }
}
