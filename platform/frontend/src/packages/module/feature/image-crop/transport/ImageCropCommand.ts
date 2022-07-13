import { TransportCommandAsync } from '@ts-core/common/transport';
import { Base64Source } from '@feature/file/lib/base64';

export class ImageCropCommand extends TransportCommandAsync<IImageCropDto, IImageCropDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ImageCropCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IImageCropDto) {
        super(ImageCropCommand.NAME, request);
    }
}

export interface IImageCropDto {
    imageBase64?: string;
    allowExtensions?: Array<string>;
}
export type IImageCropDtoResponse = Base64Source;
