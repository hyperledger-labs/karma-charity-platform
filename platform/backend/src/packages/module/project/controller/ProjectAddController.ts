import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsNotEmpty, IsBase64, ValidateNested, IsEnum, MaxLength, Length, IsArray, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { PROJECT_URL } from '@project/common/platform/api';
import { IProjectAddDto, IProjectAddDtoResponse } from '@project/common/platform/api/project';
import { Project, ProjectFileType, ProjectPreferences, ProjectPurpose, ProjectStatus, ProjectTag, PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH, PROJECT_PREFERENCES_LOCATION_MAX_LENGTH, PROJECT_PREFERENCES_PICTURE_MAX_LENGTH, PROJECT_PREFERENCES_TAGS_MAX_LENGTH, PROJECT_PREFERENCES_TITLE_MAX_LENGTH, PROJECT_PREFERENCES_TITLE_MIN_LENGTH } from '@project/common/platform/project';
import { ProjectEntity, ProjectPreferencesEntity } from '@project/module/database/project';
import { LedgerProjectRole } from '@project/common/ledger/role';
import { ProjectPurposeEntity } from '@project/module/database/project';
import { TransformGroup } from '@project/module/database';
import { ProjectUtil as CoreProjectUtil } from '../util';
import { PROJECT_ADD_ROLE, PROJECT_ADD_TYPE } from '@project/common/platform/project';
import { TraceUtil } from '@ts-core/common/trace';
import { FileService } from '@project/module/file/service';
import { FileEntity } from '@project/module/database/file';
import { ObjectUtil } from '@ts-core/common/util';
import { FileLinkType } from '@project/common/platform/file';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class ProjectAddPreferences extends ProjectPreferences {
    @IsBase64()
    declare public picture: string;
}

export class ProjectAddDto implements IProjectAddDto {
    @ApiProperty()
    @IsArray()
    purposes: Array<ProjectPurpose>;

    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @Type(() => ProjectAddPreferences)
    preferences: ProjectAddPreferences;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(PROJECT_URL)
export class ProjectAddController extends DefaultController<IProjectAddDto, IProjectAddDtoResponse> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private file: FileService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Project add', response: Project })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: PROJECT_ADD_TYPE,
        company: {
            role: PROJECT_ADD_ROLE,
            required: true,
        }
    })
    public async executeExtended(@Body() params: ProjectAddDto, @Req() request: IUserHolder): Promise<IProjectAddDtoResponse> {
        let user = request.user;
        let company = request.company;

        let item = new ProjectEntity();
        item.status = ProjectStatus.DRAFT;
        item.accounts = [];
        item.purposes = [];
        item.preferences = new ProjectPreferencesEntity();
        ObjectUtil.copyPartial(params.preferences, item.preferences, null, ['picture']);
        item.preferences.picture = '';

        item.userId = user.id;
        item.companyId = company.id;

        await this.database.getConnection().transaction(async manager => {
            let fileRepository = manager.getRepository(FileEntity);
            let roleRepository = manager.getRepository(UserRoleEntity);
            let projectRepository = manager.getRepository(ProjectEntity);

            item.purposes = params.purposes.map(purpose => new ProjectPurposeEntity(purpose));
            CoreProjectUtil.checkRequiredAccounts(item);

            item = await projectRepository.save(item);
            await roleRepository.save(Object.values(LedgerProjectRole).map(name => new UserRoleEntity(user.id, name, null, item.id)));

            let picture = await this.file.storage.upload(Buffer.from(params.preferences.picture, 'base64'), `${TraceUtil.generate()}.png`, '/project/');

            let file = new FileEntity();
            ObjectUtil.copyPartial(picture, file);
            file.type = ProjectFileType.PICTURE;
            file.linkId = item.id
            file.linkType = FileLinkType.PROJECT;
            file.mime = 'image/png';
            file.extension = 'png';
            file = await fileRepository.save(file);

            item.preferences.picture = file.path;
            item = await projectRepository.save(item);
        });

        item = await this.database.projectGet(item.id, request.user);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
