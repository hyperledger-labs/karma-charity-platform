import { Controller, Req, Res, Headers, Body, Post } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import { PAYMENT_AGGREGATOR_CLOUD_PAYMENTS_PAY_CALLBACK } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { RawBody } from '@project/module/shared/decorator';

import * as hmacSHA256 from 'crypto-js/hmac-sha256';
import * as Base64 from 'crypto-js/enc-base64';
import { PaymentUtil } from '@project/module/payment/util';
import { PaymentService } from '@project/module/payment/service';
import { ValidateUtil } from '@ts-core/common/util';
import { Transport } from '@ts-core/common/transport';
import { PaymentPayCommand } from '@project/module/payment/transport';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PaymentStatus } from '@project/common/platform/payment';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class CloudPaymentsSuccessDtoResponse {
    code: number;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PAYMENT_AGGREGATOR_CLOUD_PAYMENTS_PAY_CALLBACK)
export class CloudPaymentsPayController extends DefaultController<any, CloudPaymentsSuccessDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private service: PaymentService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Callback handler for Cloud Payments pay event', response: CloudPaymentsSuccessDtoResponse, isDisableBearer: true })
    @Post()
    public async executeExtended(@Req() request: any, @Res() response: any, @Body() body: any, @RawBody() bodyRaw: any, @Headers('content-hmac') hmac: any): Promise<CloudPaymentsSuccessDtoResponse> {
        this.log(`Received callback:\n\n${JSON.stringify(body, null, 4)}`);

        if (_.isNil(bodyRaw)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: bodyRaw is nil`);
        }
        if (_.isNil(body)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body is nil`);
        }
        if (_.isNil(body.AccountId)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.AccountId is nil`);
        }
        if (_.isNil(body.Status)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.Status is nil`);
        }
        if (_.isNil(body.OperationType) || body.OperationType !== 'Payment') {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.OperationType is nil or not "Payment"`);
        }

        let details = PaymentUtil.parseDetails(body.AccountId);
        try {
            ValidateUtil.validate(details);
        }
        catch (error) {
            this.error(`Unable to parse payment details: ${error}`);
            throw ExtendedError.create(error);
        }

        let key = await this.service.getPaymentAggregatorApiKey(details);
        let hashInBase64 = Base64.stringify(hmacSHA256(bodyRaw, key));
        if (hmac !== hashInBase64) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: received hmac signature doesn't match calculated one`);
        }

        let status = body.Status === "Completed" ? PaymentStatus.COMPLETED : PaymentStatus.AUTHORIZED;
        this.transport.send(new PaymentPayCommand({ type: PaymentAggregatorType.CLOUD_PAYMENTS, data: body, transactionId: body.TransactionId, details, status }));

        let data = { code: 0 };
        response.json(data);
        return data;
    }
}
