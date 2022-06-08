import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';

@Pipe({
    name: 'maxLength'
})
export class MaxLengthPipe extends DestroyableContainer implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(length: number, max: number): string {
        if (_.isNil(length)) {
            length = 0;
        }
        return `${length}/${max}`
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
    }
}
