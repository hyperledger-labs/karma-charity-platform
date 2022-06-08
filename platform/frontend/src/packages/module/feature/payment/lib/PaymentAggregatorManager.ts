
import { LoggerWrapper } from "@ts-core/common/logger";
import { PipeService, UserService } from "../../../core/service";
import { IPaymentWidgetOpenDto, IPaymentWidgetOpenDtoResponse } from "../transport";
import { ScriptLoader } from "./ScriptLoader";
import { APPLICATION_INJECTOR } from "@ts-core/angular";

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

    public get pipe(): PipeService {
        return APPLICATION_INJECTOR().get(PipeService);
    }

}