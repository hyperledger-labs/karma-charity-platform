import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import * as _ from 'lodash';
import { ObjectUtil } from '@ts-core/common/util';
import { ExtendedError } from '@ts-core/common/error';
import { TransportCryptoManagerEd25519 } from '@ts-core/common/transport/crypto';
import { ISignature } from '@ts-core/common/crypto';
import { TextHighlightUtil } from '../util';

export class LedgerBlockTransactionWrapper extends LedgerBlockTransaction {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static parseJSON(data: any): string {
        if (_.isNil(data)) {
            return null;
        }

        if (!_.isObject(data)) {
            return TextHighlightUtil.text(data.toString());
        }

        data = JSON.stringify(data, null, 2);
        data = TextHighlightUtil.text(data);
        return data;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    constructor(item: LedgerBlockTransaction) {
        super();
        ObjectUtil.copyProperties(item, this);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get name(): string {
        return `${this.requestName} [${this.requestId}]`;
    }

    public get isValid(): boolean {
        return this.validationCode === 0;
    }

    public get isHasRequest(): boolean {
        return !_.isNil(this.request) && !_.isNil(this.request.request);
    }

    public get isHasResponse(): boolean {
        return !_.isNil(this.response) && !_.isNil(this.response.response);
    }

    public get isError(): boolean {
        return !_.isNil(this.responseErrorCode);
    }

    public get isExecuted(): boolean {
        return this.isValid && !this.isError;
    }

    public get requestRaw(): any {
        return this.isHasRequest ? LedgerBlockTransactionWrapper.parseJSON(this.request) : null;
    }

    public get requestData(): any {
        return this.isHasRequest ? LedgerBlockTransactionWrapper.parseJSON(this.request.request) : null;
    }

    public get requestAlgorithm(): string {
        if (_.isNil(this.request) || _.isNil(this.request.options)) {
            return null;
        }

        let signature: ISignature = (this.request.options as any).signature;
        if (_.isNil(signature)) {
            return null;
        }
        let algorithm = signature.algorithm || TransportCryptoManagerEd25519.ALGORITHM;
        return `${algorithm}`;
    }

    public get responseData(): any {
        return this.isHasResponse ? LedgerBlockTransactionWrapper.parseJSON(this.response.response) : null;
    }

    public get responseErrorMessage(): string {
        if (_.isNil(this.response) || !ExtendedError.instanceOf(this.response.response)) {
            return null;
        }
        let item = this.response.response;
        let value = `${item.message}: code ${item.code}`;
        if (ObjectUtil.isJSON(item.details)) {
            value += `\n${LedgerBlockTransactionWrapper.parseJSON(JSON.parse(item.details))}`;
        }
        return value;
    }
}
