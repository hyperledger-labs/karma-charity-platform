import { Component, Input, ViewContainerRef } from '@angular/core';
import { SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import { CkeditorService, PipeService, UserService } from '@core/service';
import * as _ from 'lodash';
import { CompanyPreferences, CompanyStatus } from '@common/platform/company';
import { ISerializable } from '@ts-core/common';
import { ICompanyEditDto } from '@common/platform/api/company';
import { CompanyBaseComponent } from '../CompanyBaseComponent';
import { UserCompany } from '@project/common/platform/user';
import { PaymentAggregator, PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import Editor from '@feature/ckeditor/script/ckeditor.js';

@Component({
    selector: 'company-edit',
    templateUrl: 'company-edit.component.html'
})
export class CompanyEditComponent extends CompanyBaseComponent implements ISerializable<ICompanyEditDto> {
    //--------------------------------------------------------------------------
    //
    //  Constants
    //
    //--------------------------------------------------------------------------

    public static EVENT_SUBMITTED = 'EVENT_SUBMITTED';

    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public status: CompanyStatus;
    public statuses: SelectListItems<SelectListItem<CompanyStatus>>;

    public descriptionEditor: any;
    public paymentAggregatorTypes: SelectListItems<SelectListItem<PaymentAggregatorType>>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        pipe: PipeService,
        private user: UserService,
        private windows: WindowService,
        public ckeditor: CkeditorService,
    ) {
        super(container);
        ViewUtil.addClasses(container, 'd-flex flex-column');

        this.statuses = this.addDestroyable(new SelectListItems(pipe.language));
        Object.values(CompanyStatus).forEach((item, index) => this.statuses.add(new SelectListItem(`company.status.${item}`, index, item)));
        this.statuses.complete();

        this.paymentAggregatorTypes = this.addDestroyable(new SelectListItems(pipe.language));
        Object.values(PaymentAggregatorType).forEach((item, index) => this.paymentAggregatorTypes.add(new SelectListItem(`payment.aggregator.type.${item}`, index, item)));
        this.paymentAggregatorTypes.complete();

        this.descriptionEditor = Editor;
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    protected commitCompanyProperties(): void {
        super.commitCompanyProperties();

        let value = null;

        value = this.company.status;
        if (value !== this.status) {
            this.status = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async submit(): Promise<void> {
        await this.windows.question('company.action.save.confirmation').yesNotPromise;
        this.emit(CompanyEditComponent.EVENT_SUBMITTED);
    }

    public async geoSelect(): Promise<void> {
        /*
        let item = await this.transport.sendListen(new GeoSelectCommand(this.company.preferences.toGeo()), { timeout: DateUtil.MILISECONDS_DAY });
        this.location = item.location;
        this.latitude = item.latitude;
        this.longitude = item.longitude;
        */
    }

    public serialize(): ICompanyEditDto {
        let preferences = { ...this.company.preferences } as Partial<CompanyPreferences>;
        let paymentAggregator = { ...this.company.paymentAggregator } as Partial<PaymentAggregator>;

        let item: ICompanyEditDto = { id: this.company.id, preferences, paymentAggregator };
        if (this.isAdministrator) {
            item.status = this.status;
        }
        return item;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get isAdministrator(): boolean {
        return this.user.isAdministrator;
    }

    public get company(): UserCompany {
        return super.company;
    }
    @Input()
    public set company(value: UserCompany) {
        super.company = value;
    }
}
