import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { NativeWindowService } from '@ts-core/frontend/service';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { ExtendedError } from '@ts-core/common/error';
import { Transport } from '@ts-core/common/transport';
import { DefaultLogger } from '@ts-core/frontend/logger';
import { PaymentWidgetDetails, PaymentAggregatorData, PaymentUtil } from '@project/common/platform/payment';
import { SettingsService } from '@core/service/SettingsService';
import { ObjectUtil, TransformUtil, ValidateUtil } from '@ts-core/common/util';
import { PaymentWidgetOpenCommand } from '@feature/payment/transport/PaymentWidgetOpenCommand';
import { IPaymentAggregatorGetDtoResponse } from '@project/common/platform/api/payment';
import { CoinObjectType } from '@project/common/transport/command/coin';
import { Logger, LoggerLevel, LoggerWrapper } from '@ts-core/common/logger';
import { TransportLocal } from '@ts-core/common/transport/local';
import { PaymentService } from '@feature/payment/service/PaymentService';
import { PaymentWidgetOpenHandler } from '@feature/payment/service/PaymentWidgetOpenHandler';

//--------------------------------------------------------------------------
//
// 	Factories
//
//--------------------------------------------------------------------------

function transportFactory(logger: Logger): Transport {
    let item = new TransportLocal(logger);
    return item;
}
function loggerFactory(): Logger {
    let item = new DefaultLogger(LoggerLevel.NONE);
    return item;
}
function clientFactory(logger: Logger): Client {
    let item = new Client(logger);
    return item;
}

@Component({
    selector: 'root',
    template: '',
    providers: [
        SettingsService,
        NativeWindowService,
        { provide: Logger, useFactory: loggerFactory },
        { provide: Client, useFactory: clientFactory, deps: [Logger], },
        { provide: Transport, useFactory: transportFactory, deps: [Logger], },
    ]
})
export class RootComponent extends LoggerWrapper implements AfterViewInit {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    // public details: PaymentWidgetDetails;
    // public reference: PaymentReferenceLoader;
    // public paymentAggregator: IPaymentAggregatorGetDtoResponse;

    // this.reference = new PaymentReferenceLoader(this.api);
    // this.reference.completed.pipe(takeUntil(this.destroyed)).subscribe(() => this.transport.send(new PaymentOpenCommand(this.reference.payment.id)));

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        private element: ElementRef,
        private api: Client,
        protected settings: SettingsService,
        protected transport: Transport,
        protected nativeWindow: NativeWindowService,
        logger: Logger,
        renderer: Renderer2,
    ) {
        super(logger);

        let handler = new PaymentWidgetOpenHandler(transport, logger, new PaymentService(logger, nativeWindow));
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private async initialize(): Promise<void> {
        await this.settings.load();
        this.api.url = this.settings.apiUrl;

        let search = new URLSearchParams(this.nativeWindow.window.location.search);

        search.set('id', '2');
        search.set('type', 'COMPANY');
        search.set('details', JSON.stringify({
            coinId: 'RUB',
            coinIds: ['RUB', 'USD'],
            amount: 200,
            amounts: [100, 200],
            data: {
                email: 'renat@mail.ru',
                accountId: 'ACCOUNT_ID_5',
                description: 'Описание платежа',
                invoiceId: '123213',
                skin: 'mini',
                data: {
                    name: 'Вася',
                    nick: 'Tester',
                    phone: '+79099790296',
                    address: 'Moscow, Russia',
                    comment: 'Комментарий',
                    birthDate: '07.12.1986',
                    firstName: 'Вася',
                    middleName: 'Петров',
                    lastName: 'Иванович'
                }
            }
        }));

        if (!search.has('id') || !search.has('type')) {
            this.error(`\"id\" or \"type\" is undefined`);
            return;
        }

        let id = parseInt(search.get('id'));
        if (_.isNaN(id)) {
            this.error(`\"id\" must be positive integer`);
            return;
        }

        let type = search.get('type') as CoinObjectType;
        if (_.isNil(type)) {
            this.error(`\"type\" must be 'COMPANY' or 'PROJECT'`);
            return;
        }

        let details = null;
        if (search.has('details')) {
            if (!ObjectUtil.isJSON(search.get('details'))) {
                this.error(`\"details\" must be JSON'`);
                return;
            }
            details = TransformUtil.toClass(PaymentWidgetDetails, JSON.parse(search.get('details')));
            try {
                ValidateUtil.validate(details, true, { validationError: { target: false, value: false } });
            }
            catch (error) {
                this.error(`\"details\" invalid: ${error['message']}`);
                return;
            }
        }
        let aggregator = await this.api.paymentAggregatorGet({ id, type });
        this.open(aggregator, details);
    }

    private async open(aggregator: IPaymentAggregatorGetDtoResponse, details: PaymentWidgetDetails): Promise<void> {
        try {
            let options = await this.transport.sendListen(new PaymentWidgetOpenCommand({
                amount: aggregator.amount,
                coinId: aggregator.coinId,

                data: details.data,

                target: aggregator.target,
                details: aggregator.details,
                aggregator: aggregator.aggregator,
            }));
            this.completedHandler(PaymentUtil.parseDetails(aggregator.details), options);
        } catch (error) {
            this.failedHandler(ExtendedError.create(error));
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public async ngAfterViewInit(): Promise<void> {
        await this.initialize();
    }

    public completedHandler(item: PaymentAggregatorData, options: any): void {
        /*
        if (this.details.isWaitCallback) {
            this.reference.referenceId = item.referenceId;
            this.reference.referenceId = 'QONfIO1Z5G'
        }
        */
        options.karmaReferenceId = item.referenceId;
        window.parent.postMessage({ function: 'completedHandler', message: options }, "*");
    }

    public failedHandler(item: ExtendedError): void {
        window.parent.postMessage({ function: 'failedHandler', message: item.toObject()}, "*");
    }
}