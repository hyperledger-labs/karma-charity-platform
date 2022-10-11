
import { LoggerWrapper } from "@ts-core/common";
import { UserService } from "@core/service";
import { IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse } from "../transport";
import { APPLICATION_INJECTOR } from "@ts-core/angular";
import { ScriptLoader } from "@ts-core/frontend";
import * as _ from 'lodash';
import { LanguageService } from "@ts-core/frontend";
import { PaymentTarget } from "@project/common/platform/payment";
import { CoinObjectType } from "@project/common/transport/command/coin";

export abstract class PaymentAggregatorManager extends LoggerWrapper {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected script: ScriptLoader;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(url: string) {
        super();
        this.script = new ScriptLoader(url);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected abstract getApi<T = any>(): Promise<T>;

    protected getDataParam<U = any, V = any>(item: U, name: string, defaultValue?: V): V {
        return !_.isNil(item) && !_.isNil(item[name]) ? item[name] : defaultValue;
    }

    protected getEmail(): string {
        try {
            return !_.isNil(this.user.preferences) ? this.user.preferences.email : null;
        }
        catch (error) {
            return null;
        };
    }

    protected getDescription(item: PaymentTarget): string {
        try {
            return this.language.translate(`paymentWidget.description.${item.type === CoinObjectType.COMPANY ? 'company' : 'project'}`, { name: item.value.preferences.title });
        }
        catch (error) {
            return null;
        };
    }
    

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public abstract open(item: IPaymentWidgetOpenDto): Promise<IPaymentWidgetOpenDtoResponse>;

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get user(): UserService {
        return APPLICATION_INJECTOR().get(UserService);
    }

    public get language(): LanguageService {
        return APPLICATION_INJECTOR().get(LanguageService);
    }

}