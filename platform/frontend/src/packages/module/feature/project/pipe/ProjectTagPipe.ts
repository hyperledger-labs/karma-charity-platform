import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { LanguageService } from '@ts-core/frontend/language';
import { PrettifyPipe } from '@ts-core/angular';
import { Project } from '@project/common/platform/project';

@Pipe({
    name: 'projectTag'
})
export class ProjectTagPipe extends DestroyableContainer implements PipeTransform {
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

    public transform(item: Project): string {
        if (_.isNil(item) || _.isNil(item.preferences) || _.isEmpty(item.preferences.tags)) {
            return PrettifyPipe.EMPTY_SYMBOL;
        }
 
        let items = item.preferences.tags.map((item, index) => index === 0 ? this.language.translate(`project.tag.${item}`) : this.language.translate(`project.tag.${item}`).toLowerCase());
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
