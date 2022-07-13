import { Component } from '@angular/core';
// import { SettingsService } from '@core/service/SettingsService';
import { LoggerLevel } from '@ts-core/common/logger/LoggerLevel';
import { Logger } from '@ts-core/common/logger/Logger';
// import { Transport } from '@ts-core/common/transport';
// import { TransportLocal } from '@ts-core/common/transport/local';
// import { NativeWindowService } from '@ts-core/frontend/service';
import { DefaultLogger } from '@ts-core/frontend/logger/DefaultLogger';

//--------------------------------------------------------------------------
//
// 	Factories
//
//--------------------------------------------------------------------------

function loggerFactory(): Logger {
    let item = new DefaultLogger(LoggerLevel.NONE);
    return item;
}
/*
function transportFactory(logger: Logger): Transport {
    let item = new TransportLocal(logger);
    return item;
}
/*
function clientFactory(logger: Logger): Client {
    let item = new Client(logger);
    return item;
}
*/

@Component({
    selector: 'root',
    template: '',
    providers: [
        // SettingsService,
        // NativeWindowService,

        { provide: Logger, useFactory: loggerFactory },
        /*
        { provide: Client, useFactory: clientFactory, deps: [Logger], },
        { provide: Transport, useFactory: transportFactory, deps: [Logger], },
        */
    ]
})
export class RootComponent { }