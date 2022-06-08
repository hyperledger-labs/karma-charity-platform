import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { User } from 'common/platform/user';
import { LanguageService } from '@ts-core/frontend/language';
import { PrettifyPipe } from '@ts-core/angular';

@Pipe({
    name: 'userTitle'
})
export class UserTitlePipe extends DestroyableContainer implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private language: LanguageService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(item: User): string {
        if (_.isNil(item)) {
            return PrettifyPipe.EMPTY_SYMBOL;
        }
        if (!_.isNil(item.preferences) && !_.isEmpty(item.preferences.name)) {
            return item.preferences.name;
        }
        return item.login;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
    }
}
