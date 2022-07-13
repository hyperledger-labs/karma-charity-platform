import { IPaginable, IPagination } from '@ts-core/common/dto';
import { ITraceable } from '@ts-core/common/trace';
import { File } from '../../file';

export interface IFileListDto extends IPaginable<File>, ITraceable { }

export interface IFileListDtoResponse extends IPagination<File> { }
