import { Controller, Get, Req, Res, Headers, Body, Post } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { Logger } from '@ts-core/common/logger';
import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import axios, { Method, AxiosRequestConfig } from 'axios';
import { PAYMENT_AGGREGATOR_CLOUD_PAYMENTS_PAY_CALLBACK } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { RawBody } from '@project/module/shared/decorator';
import { PaymentAggregatorData, PaymentUtil } from '@project/common/platform/payment';
import { PaymentService } from '@project/module/payment/service';
import { ObjectUtil, ValidateUtil } from '@ts-core/common/util';
import { Transport } from '@ts-core/common/transport';
import { PaymentPayCommand } from '@project/module/payment/transport';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PaymentStatus } from '@project/common/platform/payment';
import { DatabaseService } from '@project/module/database/service';
import { CoinObjectType } from '@project/common/transport/command/coin';
import { CompanyEntity } from '@project/module/database/company';

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

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    /*
    private checkSignature():void {
        let key = await this.service.getPaymentAggregatorApiKey(details);
        let hashInBase64 = Base64.stringify(hmacSHA256(bodyRaw, key));
        if (hmac !== hashInBase64) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: received hmac signature doesn't match calculated one`);
        }
    }
    */

    private async parse(@Req() request: any, @Res() response: any, @Body() body: any, @RawBody() bodyRaw: any, @Headers('content-hmac') hmac: any, method: Method): Promise<CloudPaymentsSuccessDtoResponse> {
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
        if (_.isNil(body.Data)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.Data is nil`);
        }
        if (_.isNil(body.OperationType) || body.OperationType !== 'Payment') {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.OperationType is nil or not "Payment"`);
        }

        if (!ObjectUtil.isJSON(body.Data)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.Data is invalid json`);
        }
        let data = JSON.parse(body.Data);
        if (_.isNil(data.karmaDetails)) {
            throw new ExtendedError(`Unable to parse Cloud Payments callback: body.Data is nil`);
        }

        let details = PaymentUtil.parseDetails(data.karmaDetails);
        try {
            ValidateUtil.validate(details);
        }
        catch (error) {
            this.error(`Unable to parse payment details: ${error}`);
            throw ExtendedError.create(error);
        }

        this.log(`Received payment:`, JSON.stringify(details));

        let status = body.Status === "Completed" ? PaymentStatus.COMPLETED : PaymentStatus.AUTHORIZED;
        this.transport.send(new PaymentPayCommand({ type: PaymentAggregatorType.CLOUD_PAYMENTS, data: body, transactionId: body.TransactionId, details, status }));

        let callbackUrl = await this.getCallbackUrl(details);
        if (!_.isEmpty(callbackUrl)) {
            let headers = { ...request.headers };
            headers['Karma-payment-reference-id'] = details.referenceId;
            return axios.request({ url: callbackUrl, data: bodyRaw, headers, method, });
        }

        response.json({ code: 0 });
        // return { code: 0 };
    }

    private async getCallbackUrl(details: PaymentAggregatorData): Promise<string> {
        let company: CompanyEntity = null;
        switch (details.target.type) {
            case CoinObjectType.COMPANY:
                company = await this.database.companyGet(details.target.id);
                break;
            case CoinObjectType.PROJECT:
                let project = await this.database.projectGet(details.target.id);
                if (!_.isNil(project)) {
                    company = await this.database.companyGet(project.companyId);
                }
                break;
        }
        return !_.isNil(company) ? company.paymentAggregator.callbackUrl : null;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Callback handler for Cloud Payments pay event', response: CloudPaymentsSuccessDtoResponse, isDisableBearer: true })
    @Post()
    public async executeExtendedPost(@Req() request: any, @Res() response: any, @Body() body: any, @RawBody() bodyRaw: any, @Headers('content-hmac') hmac: any): Promise<CloudPaymentsSuccessDtoResponse> {
        return this.parse(request, response, body, bodyRaw, hmac, 'post');
    }

    @Get()
    public async executeExtendedGet(@Req() request: any, @Res() response: any, @Body() body: any, @RawBody() bodyRaw: any, @Headers('content-hmac') hmac: any): Promise<CloudPaymentsSuccessDtoResponse> {
        return this.parse(request, response, body, bodyRaw, hmac, 'get');
    }
}
