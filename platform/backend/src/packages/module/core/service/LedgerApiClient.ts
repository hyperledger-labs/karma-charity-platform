import { ClassType } from '@ts-core/common/util';
import { ILogger } from '@ts-core/common/logger';
import { TransportCryptoManagerEd25519 } from '@ts-core/common/transport/crypto';
import { Transport, ITransportCommand, TransportCommand, ITransportCommandOptions, TransportCommandAsync } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { ILedgerRequestRequest, LedgerApiClient as CommonLedgerApiClient } from '@hlf-explorer/common/api';
import { IKarmaLedgerEventDto } from '@project/common/transport/event';
import { ExtendedError } from '@ts-core/common/error';
import { DateUtil } from '@ts-core/common/util';
// import { TransportCryptoManagerRSA } from '@ts-core/crypto-rsa/transport';
import { PromiseHandler } from "@ts-core/common/promise";
import { CryptoLedgerSignCommand } from '@project/module/crypto/transport';

export class LedgerApiClient extends CommonLedgerApiClient {

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    protected signer: ISignerSettings;
    protected transport: Transport;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger, transport: Transport, url?: string, defaultLedgerName?: string) {
        super(logger, url, defaultLedgerName)
        this.transport = transport;
        this.settings.defaultTimeout = DateUtil.MILLISECONDS_MINUTE;
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async createRequest<U>(
        command: ITransportCommand<U>,
        options?: ITransportCommandOptions,
        ledgerName?: string
    ): Promise<ILedgerRequestRequest> {
        let item = await super.createRequest<U>(command, options, ledgerName);
        if (_.isNil(this.signer)) {
            return item;
        }
        options = item.options;
        options['userId'] = this.signer.uid;
        options['signature'] = await this.transport.sendListen(new CryptoLedgerSignCommand({
            uid: this.signer.uid,
            isDisableDecryption: this.signer.isDisableDecryption,
            command
        }));
        if (!this.signer.isKeepAfterSigning) {
            this.setSigner(null);
        }
        this.batch();
        return item;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public async getCommandByEvent<U extends ITransportCommand<T>, T = any>(type: ClassType<U>, event: IKarmaLedgerEventDto): Promise<U> {
        let transaction = await this.getTransaction(event.transactionHash);
        if (_.isNil(transaction)) {
            throw new ExtendedError(`Unable to find transaction by "${event.transactionHash}" hash`);
        }
        if (transaction.validationCode !== 0) {
            throw new ExtendedError(`Transaction "${event.transactionHash}" finished by ${transaction.validationCode} validationCode`);
        }

        let item = new type(transaction.request.request);
        if (item instanceof TransportCommandAsync) {
            item.response(transaction.response.response);
        }
        return item;
    }

    public async batch(delay: number = 3000): Promise<void> {
        if (delay > 0) {
            await PromiseHandler.delay(delay);
        }
        let command = new TransportCommandAsync('transportFabricBatch');
        let options = {
            signature: await TransportCommand.sign(command, new TransportCryptoManagerEd25519(), {
                publicKey: "e365007e85508c6b44d5101a1d59d0061a48fd1bcd393186ccb5e7ae938a59a8",
                privateKey: "e87501bc00a3db3ba436f7109198e0cb65c5f929eabcedbbb5a9874abc2c73a3e365007e85508c6b44d5101a1d59d0061a48fd1bcd393186ccb5e7ae938a59a8"
            })
        } as ITransportCommandOptions;


        let signer = this.signer;
        this.signer = null;
        await this.ledgerRequestSendListen(command, options, 'Karma');
        this.signer = signer;
    }

    public setSigner(settings: ISignerSettings): void {
        this.signer = settings;
    }
}

export interface ISignerSettings {
    uid: string;
    isKeepAfterSigning?: boolean;
    isDisableDecryption?: boolean;
}

