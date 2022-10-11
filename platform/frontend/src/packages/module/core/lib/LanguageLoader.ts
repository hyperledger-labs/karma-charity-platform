import { Client } from "@project/common/platform/api";
import { LanguageUrlLoader } from "@ts-core/language";
import * as _ from 'lodash';
import { SettingsService } from "../service";

export class LanguageLoader extends LanguageUrlLoader {

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: Client, private settings: SettingsService) {
        super(null);
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected loadLocale(locale: string): Promise<any> {
        // return this.api.locale(locale, this.settings.version);
        return null;
    }
}