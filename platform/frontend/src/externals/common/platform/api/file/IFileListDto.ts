import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { File } from '../../file';

export interface IFileListDto extends IPaginable<File>, ITraceable { }

export interface IFileListDtoResponse extends IPagination<File> { }
