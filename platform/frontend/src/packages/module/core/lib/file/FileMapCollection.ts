import { FilterableConditions, FilterableConditionType, FilterableDataType, IPagination, ParseFilterableCondition } from '@ts-core/common/dto';
import { TransformUtil } from '@ts-core/common/util';
import { CdkTablePaginableMapCollection, ICdkTableColumn, ICdkTableSettings, MomentDatePipe } from '@ts-core/angular';
import { Client } from 'common/platform/api';
import { File } from '@project/common/platform/file';
import { PipeService, UserService } from '../../service';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class FileMapCollection extends CdkTablePaginableMapCollection<any, File> {
    //--------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    //--------------------------------------------------------------------------

    public static parseItem(item: any): File {
        return TransformUtil.toClass(File, item);
    }

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected api: Client) {
        super('id');
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected createRequestData(): any {
        let item = super.createRequestData();
        ParseFilterableCondition(item.conditions, 'createdDate', FilterableDataType.DATE, FilterableConditionType.EQUAL, this.parseDate);
        return item;
    }

    protected parseDate = <File>(value: Date, conditions: FilterableConditions<File>): string => MomentDatePipe.toConditionValue(value);

    protected isNeedClearAfterLoad(): boolean {
        return true;
    }

    protected request(): Promise<IPagination<File>> {
        return this.api.fileList(this.createRequestData());
    }

    protected parseItem(item: any): File {
        return FileMapCollection.parseItem(item);
    }
}

export class FileTableSettings implements ICdkTableSettings<File> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public columns: Array<ICdkTableColumn<File>>;
    public static COLUMN_NAME_MENU = 'menu';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(pipe: PipeService, user: UserService) {
        this.columns = [];
        this.columns.push({
            name: FileTableSettings.COLUMN_NAME_MENU,
            headerId: '',
            headerClassName: 'ps-3',
            className: 'ps-3 fas fa-ellipsis-v',
            isDisableSort: true,
        });
        this.columns.push({
            name: 'name',
            headerId: 'file.name',
            isDisableSort: true,
            format: item => item.name
        })
        this.columns.push({
            name: 'type',
            headerId: 'file.type.type',
            format: item => pipe.language.translate(`file.type.${item.type}`)
        })
        /*
        if (user.isAdministrator) {
            this.columns.push({
                name: 'type',
                headerId: 'user.type.type',
                format: item => pipe.language.translate(`user.type.${item.type}`)
            })
            this.columns.push({
                name: 'login',
                headerId: 'user.login',
                format: item => item.login,
            })
        }
        */
        this.columns.push({
            name: 'createdDate',
            headerId: 'file.createdDate',
            format: item => pipe.momentDate.transform(item.createdDate)
        });
    }
}

