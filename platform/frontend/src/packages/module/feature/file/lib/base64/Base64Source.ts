import * as _ from 'lodash';

export class Base64Source {
    //--------------------------------------------------------------------------
    //
    //	Constants
    //
    //--------------------------------------------------------------------------

    private static PREFIX = 'base64,';

    //--------------------------------------------------------------------------
    //
    //	Static Methods
    //
    //--------------------------------------------------------------------------

    public static isBase64(item: string): boolean {
        return !_.isNil(item) ? item.includes(Base64Source.PREFIX) : false;
    }

    public static getSource(item: string): string {
        return Base64Source.isBase64(item) ? item.substr(item.indexOf(Base64Source.PREFIX) + Base64Source.PREFIX.length) : null;
    }

    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    public source: string;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(source?: string) {
        if (_.isNil(source)) {
            return;
        }
        let index = source.indexOf(Base64Source.PREFIX);
        this.source = index === -1 ? source : source.substr(index + Base64Source.PREFIX.length);
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    public get image(): string {
        return 'data:image/png;base64,' + this.source.replace(/(\r\n|\n|\r)/gm, '');
    }
}
