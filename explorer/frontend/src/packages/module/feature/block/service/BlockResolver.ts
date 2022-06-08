import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import * as _ from 'lodash';
import { LedgerBlock, LedgerBlockEvent, LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { RouterService } from '@core/service';
import { WindowService } from '@ts-core/angular';
import { BLOCK_URL, LedgerApiClient } from '@hlf-explorer/common/api';
import { ILedgerBlockGetRequest, ILedgerBlockGetResponse } from '@hlf-explorer/common/api/block';

@Injectable({ providedIn: 'root' })
export class BlockResolver implements Resolve<LedgerBlock> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private api: LedgerApiClient, private router: RouterService, private windows: WindowService) { }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<LedgerBlock> {
        let hashOrNumber = route.params.hashOrNumber;
        if (_.isNil(hashOrNumber)) {
            let message = `Block number or hash ${hashOrNumber} is invalid`;
            this.windows.info(message);
            this.router.navigate(RouterService.DEFAULT_URL);
            return Promise.reject(message);
        }

        try {
            console.log('called', this.api);
            return await this.api.getBlock(hashOrNumber);
        } catch (error) {
            this.router.navigate(RouterService.DEFAULT_URL);
            return Promise.reject(error.toString());
        }
    }
}