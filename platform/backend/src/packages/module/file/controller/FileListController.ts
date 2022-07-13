import { Controller, Get, Req, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder } from '@project/module/database/user';
import { FILE_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { File } from '@project/common/platform/file';
import { FileEntity } from '@project/module/database/file';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class FileListDto implements Paginable<File> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<File>;

    @ApiPropertyOptional()
    sort?: FilterableSort<File>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class FileListDtoResponse implements IPagination<File> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: File })
    items: Array<File>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(FILE_URL)
export class FileListController extends DefaultController<FileListDto, FileListDtoResponse> {
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

    @Swagger({ name: 'Get file list', response: FileListDtoResponse })
    @Get()
    public async executeExtended(@Query({ transform: Paginable.transform }) params: FileListDto, @Req() request: IUserHolder): Promise<FileListDtoResponse> {
        let query = this.database.file.createQueryBuilder('file')
        //.innerJoinAndSelect('user.preferences', 'preferences');

        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: FileEntity): Promise<File> => item.toObject();
}
