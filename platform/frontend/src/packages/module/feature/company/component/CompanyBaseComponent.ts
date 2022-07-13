
import { Company, COMPANY_PREFERENCES_ADDRESS_MAX_LENGTH, COMPANY_PREFERENCES_EMAIL_MAX_LENGTH, COMPANY_PREFERENCES_INN_MAX_LENGTH, COMPANY_PREFERENCES_INN_MIN_LENGTH, COMPANY_PREFERENCES_PHONE_MAX_LENGTH, COMPANY_PREFERENCES_STRING_MAX_LENGTH, COMPANY_PREFERENCES_TITLE_MAX_LENGTH, COMPANY_PREFERENCES_TITLE_MIN_LENGTH, COMPANY_PREFERENCES_WEBSITE_MAX_LENGTH } from "@project/common/platform/company";
import { UserCompany } from "@project/common/platform/user";
import { IWindowContent } from "@ts-core/angular";
import * as _ from 'lodash';

export abstract class CompanyBaseComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _company: UserCompany;

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    protected commitCompanyProperties(): void { }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.company = null;
    }
    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public get company(): UserCompany {
        return this._company;
    }
    public set company(value: UserCompany) {
        if (value === this._company) {
            return;
        }
        this._company = value;
        if (!_.isNil(value)) {
            this.commitCompanyProperties();
        }
    }

    public get stringMaxLength(): number {
        return COMPANY_PREFERENCES_STRING_MAX_LENGTH;
    }
    public get phoneMaxLength(): number {
        return COMPANY_PREFERENCES_PHONE_MAX_LENGTH;
    }
    public get websiteMaxLength(): number {
        return COMPANY_PREFERENCES_WEBSITE_MAX_LENGTH;
    }
    public get addressMaxLength(): number {
        return COMPANY_PREFERENCES_ADDRESS_MAX_LENGTH;
    }
    public get emailMaxLength(): number {
        return COMPANY_PREFERENCES_EMAIL_MAX_LENGTH;
    }
    public get innMinLength(): number {
        return COMPANY_PREFERENCES_INN_MIN_LENGTH;
    }
    public get innMaxLength(): number {
        return COMPANY_PREFERENCES_INN_MAX_LENGTH;
    }
    public get titleMinLength(): number {
        return COMPANY_PREFERENCES_TITLE_MIN_LENGTH;
    }
    public get titleMaxLength(): number {
        return COMPANY_PREFERENCES_TITLE_MAX_LENGTH;
    }
}