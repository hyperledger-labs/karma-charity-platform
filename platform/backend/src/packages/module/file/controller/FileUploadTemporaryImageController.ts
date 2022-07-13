import { Req, Controller, Res, Post, UseInterceptors, UseGuards, UploadedFile } from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserType } from '@project/common/platform/user';
import { FILE_TEMPORARY_IMAGE_URL } from '@project/common/platform/api';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder } from '@project/module/database/user';
import { FileService, IFileRequest } from '../service';
import { ExtendedError } from '@ts-core/common/error';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${FILE_TEMPORARY_IMAGE_URL}`)
export class FileUploadTemporaryImageController extends DefaultController<void, void> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private service: FileService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @UseInterceptors(FileInterceptor('upload', {
        limits: FileService.limits,
        storage: FileService.storageMemory,
        fileFilter: FileService.uploadTemporaryImageFilter
    }))
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.COMPANY_WORKER, UserType.COMPANY_MANAGER] })
    public async executeExtended(
        @Req() request: IUserHolder & IFileRequest,
        @UploadedFile() file: any,
        @Res() response: any,
    ): Promise<any> {
        try {
            let item = await this.service.storage.upload(file.buffer, FileService.nameInterceptor(request, file), '/temporary/');
            response.status(200).json({ url: item.path });
        }
        catch (error) {
            response.status(ExtendedError.HTTP_CODE_BAD_REQUEST).json({ error: { message: error.message } });
        }

    }
}
