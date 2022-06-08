import * as _ from 'lodash';

export class Base64File implements File {
    //--------------------------------------------------------------------------
    //
    //	Constants
    //
    //--------------------------------------------------------------------------

    public static FILE_NAME = 'image.jpg';
    public static FILE_TYPE = 'image/jpg';
    public static FILE_FORM_FIELD = 'imageBase64';

    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    public base64: string;

    public text: () => Promise<string>;
    public stream: () => any;
    public arrayBuffer: () => Promise<ArrayBuffer>;

    public size: number;
    public name: string;
    public type: string;
    public lastModified: any;
    public lastModifiedDate: any;
    public webkitRelativePath: string;

    //--------------------------------------------------------------------------
    //
    //	Constants
    //
    //--------------------------------------------------------------------------

    constructor() {
        this.size = 100;
        this.type = Base64File.FILE_TYPE;
        this.name = Base64File.FILE_NAME;
        this.lastModifiedDate = new Date();
    }

    //--------------------------------------------------------------------------
    //
    //	Public Methods
    //
    //--------------------------------------------------------------------------

    public msClose(): void {}

    public msDetachStream(): any {
        return null;
    }
    
    public slice(start?: number, end?: number, contentType?: string): Blob {
        return null;
    }
}
