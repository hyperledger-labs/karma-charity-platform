import { Loadable } from '@ts-core/common';
import { ViewUtil } from '@ts-core/angular';
import * as _ from 'lodash';
import { PromiseHandler } from '@ts-core/common/promise';

export class ScriptLoader extends Loadable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private url: string;
    private promise: PromiseHandler<void>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(url: string) {
        super();
        this.url = url;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async load(): Promise<void> {
        if (!_.isNil(this.promise)) {
            return this.promise.promise;
        }

        let script = ViewUtil.createElement('script');
        ViewUtil.appendChild(document.documentElement.firstChild, script)
        script.onload = () => this.promise.resolve();
        script.onerror = (event) => this.promise.reject(event.toString());
        script.src = this.url;

        this.promise = PromiseHandler.create<void>();
        return this.promise.promise;
    }

}