import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { User, UserRoleName } from 'common/platform/user';
import { LanguageService } from '@ts-core/frontend/language';
import { PrettifyPipe } from '@ts-core/angular';

@Pipe({
    name: 'role'
})
export class RolePipe extends DestroyableContainer implements PipeTransform {
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

    public transform(item: UserRoleName | Array<UserRoleName>): string {
        if (_.isNil(item)) {
            return PrettifyPipe.EMPTY_SYMBOL;
        }
        if (!_.isArray(item)) {
            item = [item];
        }
        let items = item.map((item, index) => index === 0 ? this.language.translate(`role.name.${item}`) : this.language.translate(`role.name.${item}`).toLowerCase());
        return items.join(', ').trim();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
    }
}
