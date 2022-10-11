import { Body, Req, Controller, Post, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { IsString, IsEnum, IsBase64, IsNumber } from 'class-validator';
import * as _ from 'lodash';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserType } from '@project/common/platform/user';
import { FILE_BASE64_URL } from '@project/common/platform/api';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder } from '@project/module/database/user';
import { FileService, IFileRequest } from '../service';
import { FileLinkType } from '@project/common/platform/file';
import { IFileBase64UploadDto, IFileUploadDtoResponse } from '@project/common/platform/api/file';
import { ObjectUtil, RandomUtil } from '@ts-core/common';
import { TraceUtil } from '@ts-core/common';
import { FileEntity } from '@project/module/database/file';

// --------------------------------------------------------------------------
//
//  Properties
//
// --------------------------------------------------------------------------

export class FileBase64UploadDto implements IFileBase64UploadDto {
    @IsString()
    public type: string;

    @IsNumber()
    public linkId: number;

    @IsEnum(FileLinkType)
    public linkType: FileLinkType;

    @IsBase64()
    public data: string;

    @IsString()
    public mime: string;

    @IsString()
    public extension: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(FILE_BASE64_URL)
export class FileBase64UploadController extends DefaultController<IFileBase64UploadDto, IFileUploadDtoResponse> {
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

    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.COMPANY_WORKER, UserType.COMPANY_MANAGER] })
    public async executeExtended(@Body() params: FileBase64UploadDto, @Req() request: IUserHolder & IFileRequest): Promise<IFileUploadDtoResponse> {
        let buffer = Buffer.from(params.data, 'base64');
        let file = await this.file.storage.upload(buffer, `${TraceUtil.generate()}.${params.extension}`, '/base64/');
        
        let item = new FileEntity();
        ObjectUtil.copyPartial(file, item);

        item.type = params.type;
        item.linkId = Number(params.linkId);
        item.linkType = params.linkType;

        item.mime = params.mime;
        item.extension = params.extension;

        item = await this.database.file.save(item);
        return item.toObject();
    }
}
