import { Delete, Req, Param, Controller, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { ParseIntPipe } from '@nestjs/common';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserType } from '@project/common/platform/user';
import { ProjectStatus } from '@project/common/platform/project';
import { FILE_URL } from '@project/common/platform/api';
import { DatabaseService } from '@project/module/database/service';
import { ExtendedError, UnreachableStatementError } from '@ts-core/common/error';
import { IUserHolder } from '@project/module/database/user';
import { FileService } from '../service';
import { FileLinkType } from '@project/common/platform/file';
import { IFileRemoveDtoResponse } from '@project/common/platform/api/file';
import { FileNotFoundError } from '@project/module/core/middleware';
import { LedgerCompanyRole, LedgerProjectRole } from '@project/common/ledger/role';
import { CompanyFileAllowExtensions, CompanyStatus } from '@project/common/platform/company';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${FILE_URL}/:id`)
export class FileRemoveController extends DefaultController<number, IFileRemoveDtoResponse> {
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

    @Delete()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.COMPANY_WORKER, UserType.COMPANY_MANAGER] })
    public async executeExtended(@Param('id', ParseIntPipe) fileId: number, @Req() request: IUserHolder): Promise<IFileRemoveDtoResponse> {
        let item = await this.database.file.findOne(fileId);
        if (_.isNil(item)) {
            throw new FileNotFoundError();
        }

        switch (item.linkType) {
            case FileLinkType.PROJECT:
                let project = await this.database.projectGet(item.linkId, request.user);
                UserGuard.checkProject({
                    isProjectRequired: true,
                    projectStatus: [ProjectStatus.DRAFT, ProjectStatus.REJECTED, ProjectStatus.VERIFIED, ProjectStatus.ACTIVE, ProjectStatus.COLLECTED],
                    projectRole: [LedgerProjectRole.COIN_MANAGER, LedgerProjectRole.USER_MANAGER, LedgerProjectRole.PROJECT_MANAGER]
                }, project);
                break;
            case FileLinkType.COMPANY:
                let company = await this.database.companyGet(item.linkId, request.user);
                UserGuard.checkCompany({
                    isCompanyRequired: true,
                    companyStatus: [CompanyStatus.DRAFT, CompanyStatus.REJECTED, CompanyStatus.ACTIVE],
                    companyRole: [LedgerCompanyRole.COIN_MANAGER, LedgerCompanyRole.USER_MANAGER, LedgerCompanyRole.PROJECT_MANAGER]
                }, company);
                break;
            default:
                throw new UnreachableStatementError(item.linkType);
        }

        if (await this.service.storage.remove(item)) {
            await this.database.file.delete(item.id);
        }
        return item.toObject();
    }
}
