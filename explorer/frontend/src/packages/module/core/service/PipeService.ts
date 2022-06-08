import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LanguageService } from '@ts-core/frontend/language';
import { PipeBaseService } from '@ts-core/angular';
import { ThemeService } from '@ts-core/frontend/theme';

@Injectable({ providedIn: 'root' })
export class PipeService extends PipeBaseService {
    //--------------------------------------------------------------------------
    //
    // 	Constants
    //
    //--------------------------------------------------------------------------



    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(language: LanguageService, sanitizer: DomSanitizer) {
        super(language, sanitizer);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    /*
    public get clockGeo(): ClockGeoPipe {
        if (!PipeService.CLOCK_GEO_PIPE) {
            PipeService.CLOCK_GEO_PIPE = new ClockGeoPipe(this);
        }
        return PipeService.CLOCK_GEO_PIPE;
    }
    */

}
