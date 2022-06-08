import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { IRouterDeactivatable, SelectListItem, SelectListItems, ViewUtil, WindowService } from '@ts-core/angular';
import * as _ from 'lodash';
import { ISerializable } from '@ts-core/common';
import { CompanyPreferences } from '@project/common/platform/company';
import { Client } from 'common/platform/api';
import { ObjectUtil } from '@ts-core/common/util';
import { CompanyBaseComponent } from '../CompanyBaseComponent';
import { ICompanyAddDto } from '@project/common/platform/api/company';
import { PaymentAggregator, PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PipeService, RouterService, CkeditorService, CompanyService } from '../../../../core/service';
import { UserCompany } from 'common/platform/user';
import { ImageCropCommand } from '../../../image-crop/transport';
import { Transport } from '@ts-core/common/transport';
import Editor from '../../../ckeditor/script/ckeditor.js';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'company-add',
    templateUrl: 'company-add.component.html'
})
export class CompanyAddComponent extends CompanyBaseComponent implements IRouterDeactivatable, ISerializable<ICompanyAddDto> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    @ViewChild('form', { read: NgForm, static: false })
    private form: NgForm;

    public isNalogLoaded: boolean;
    public paymentAggregatorTypes: SelectListItems<SelectListItem<PaymentAggregatorType>>;
    public descriptionEditor: any;
    public isForceDeactivate: boolean;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        container: ViewContainerRef,
        private transport: Transport,
        private pipe: PipeService,
        private api: Client,
        private windows: WindowService,
        private service: CompanyService,
        private router: RouterService,
        public ckeditor: CkeditorService,
    ) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');

        this.paymentAggregatorTypes = this.addDestroyable(new SelectListItems(this.pipe.language));
        Object.values(PaymentAggregatorType).forEach((item, index) => this.paymentAggregatorTypes.add(new SelectListItem(`payment.aggregator.type.${item}`, index, item)));
        this.paymentAggregatorTypes.complete();

        this.company = new UserCompany();
        this.company.preferences = new CompanyPreferences();
        this.company.preferences.inn = '7751161170';
        this.company.preferences.description = '';

        this.company.paymentAggregator = new PaymentAggregator();
        this.company.paymentAggregator.type = PaymentAggregatorType.CLOUD_PAYMENTS;
        this.company.paymentAggregator.uid = 'pk_7cf84ef18b04bbe7611e317958dc0';
        this.company.paymentAggregator.key = '484fad603e581acc459923ac9476e4b9';

        this.descriptionEditor = Editor;
    }

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    public async load(): Promise<void> {
        if (this.isDisabled) {
            return;
        }

        this.isDisabled = true;
        this.isNalogLoaded = false;

        let nalog = null;
        try {
            let [item] = await this.api.nalogSearch(this.company.preferences.inn);
            nalog = item;
            if (_.isEmpty(item)) {
                this.windows.info(`company.add.noNalogObject`);
                return;
            }
            ObjectUtil.copyProperties(item, this.company.preferences);
            this.company.preferences.title = this.company.preferences.nameShort;
            this.company.preferences.addressPost = this.company.preferences.address;
        }
        finally {
            this.isDisabled = false;
            this.isNalogLoaded = !_.isNil(nalog);
        }
    }

    public async isCanDeactivate(): Promise<boolean> {
        if (!_.isNil(this.form) && !this.form.dirty) {
            return true;
        }
        await this.windows.question('project.add.exitConfirmation').yesNotPromise;
        this.isForceDeactivate = true;
        return true;
    }

    public async submit(): Promise<void> {
        await this.windows.question('company.action.save.confirmation').yesNotPromise;

        this.service.company = await this.api.companyAdd(this.serialize());
        this.isForceDeactivate = true;
        this.router.navigate(RouterService.COMPANY_URL);
    }

    public async pictureEdit(): Promise<void> {
        let item = await this.transport.sendListen(new ImageCropCommand({ imageBase64: this.company.preferences.picture }));
        this.company.preferences.picture = item.source;
    }

    public async geoSelect(): Promise<void> {
        /*
        let item = await this.transport.sendListen(new GeoSelectCommand(this.user.preferences.toGeo()), { timeout: DateUtil.MILISECONDS_DAY });
        this.location = item.location;
        this.latitude = item.latitude;
        this.longitude = item.longitude;
        */
    }

    public serialize(): ICompanyAddDto {
        return {
            preferences: this.company.preferences,
            paymentAggregator: this.company.paymentAggregator
        }
    }
}
