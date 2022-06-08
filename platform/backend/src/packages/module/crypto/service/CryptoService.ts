import { ITransportCommand } from '@ts-core/common/transport';
import { ISignature } from '@ts-core/common/crypto';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { ITransportCryptoManager, TransportCryptoManagerEd25519 } from '@ts-core/common/transport/crypto';
import * as _ from 'lodash';
import { CryptoKeyType } from '@project/common/platform/crypto';
import { ExtendedError } from "@ts-core/common/error";
import { IKeyAsymmetric, Ed25519 } from "@ts-core/common/crypto";
import { GostR3410 } from "@ts-core/crypto-gost";
import { TransportCryptoManagerGostR3410 } from "@ts-core/crypto-gost/transport";

export class CryptoService extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    private _managers: Map<string, ITransportCryptoManager>;
    private settings: ICryptoSettings;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, settings: ICryptoSettings) {
        super(logger);

        this.settings = settings;

        this._managers = new Map();
        this.managers.set(TransportCryptoManagerEd25519.ALGORITHM, new TransportCryptoManagerEd25519());
        this.managers.set(TransportCryptoManagerGostR3410.ALGORITHM, new TransportCryptoManagerGostR3410());
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async keys(algorithm: string): Promise<IKeyAsymmetric> {
        switch (algorithm) {
            case TransportCryptoManagerEd25519.ALGORITHM:
                return Ed25519.keys();
            case TransportCryptoManagerGostR3410.ALGORITHM:
                return GostR3410.keys();
            default:
                throw new ExtendedError(`Unable to generate crypto keys: unknown "${algorithm}" algorithm`);
        }
    }

    public async encrypt(type: CryptoKeyType, value: string): Promise<string> {
        if (type === CryptoKeyType.DATABASE) {
            return Ed25519.encrypt(value, this.settings.databaseEncryptionKey, this.settings.databaseEncryptionNonce);
        }
        throw new ExtendedError(`Unable to encrypt: unknown key "${type}" name`);
    }

    public async decrypt(type: CryptoKeyType, value: string): Promise<string> {
        if (type === CryptoKeyType.DATABASE) {
            return Ed25519.decrypt(value, this.settings.databaseEncryptionKey, this.settings.databaseEncryptionNonce);
        }
        throw new ExtendedError(`Unable to decrypt: unknown key "${type}" name`);
    }


    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get managers(): Map<string, ITransportCryptoManager> {
        return this._managers;
    }


}

export interface ICryptoSettings {
    databaseEncryptionNonce: string
    databaseEncryptionKey: string
}

