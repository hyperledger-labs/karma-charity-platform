import { Body, Req, Controller, Post, UseInterceptors, UseGuards, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { IsString, IsEnum, IsNumberString } from 'class-validator';
import * as _ from 'lodash';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserType } from '@project/common/platform/user';
import { FILE_URL } from '@project/common/platform/api';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder } from '@project/module/database/user';
import { IFile, IFileRequest } from '../service';
import { FileEntity } from '@project/module/database/file';
import { File, FileLinkType } from '@project/common/platform/file';
import { ObjectUtil } from '@ts-core/common';
import { IFileUploadDto, IFileUploadDtoResponse } from '@project/common/platform/api/file';

// --------------------------------------------------------------------------
//
//  Properties
//
// --------------------------------------------------------------------------

export class FileUploadDto implements IFileUploadDto {
    @IsString()
    type: string;

    @IsNumberString()
    linkId: number;

    @IsEnum(FileLinkType)
    linkType: FileLinkType;

    @IsString()
    mime: string;

    @IsString()
    extension: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(FILE_URL)
export class FileUploadController extends DefaultController<void, File> {
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

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.COMPANY_WORKER, UserType.COMPANY_MANAGER] })
    public async executeExtended(
        @Req() request: IUserHolder & IFileRequest,
        @Body() params: FileUploadDto,
        @UploadedFile() file: IFile
    ): Promise<IFileUploadDtoResponse> {
        let item = new FileEntity();
        ObjectUtil.copyPartial(file, item);

        item.type = params.type;
        item.linkId = Number(params.linkId);
        item.linkType = params.linkType;

        item.mime = request.details.mime;
        item.extension = request.details.extension;

        item = await this.database.file.save(item);
        return item.toObject();
    }
}
