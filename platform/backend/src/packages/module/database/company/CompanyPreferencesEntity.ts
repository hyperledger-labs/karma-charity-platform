import { IGeo } from '@project/common/platform/geo';
import {
    CompanyPreferences,
    COMPANY_PREFERENCES_TITLE_MIN_LENGTH,
    COMPANY_PREFERENCES_TITLE_MAX_LENGTH,
    COMPANY_PREFERENCES_PHONE_MAX_LENGTH,
    COMPANY_PREFERENCES_STRING_MAX_LENGTH,
    COMPANY_PREFERENCES_PICTURE_MAX_LENGTH,
    COMPANY_PREFERENCES_WEBSITE_MAX_LENGTH,
    COMPANY_PREFERENCES_DESCRIPTION_MIN_LENGTH,
    COMPANY_PREFERENCES_DESCRIPTION_MAX_LENGTH,
    COMPANY_PREFERENCES_CITY_MAX_LENGTH,
} from '@project/common/platform/company';
import { TypeormDecimalTransformer } from '@ts-core/backend';
import { Exclude, Type } from 'class-transformer';
import { IsEmail, IsDate, Length, MaxLength, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyEntity } from './CompanyEntity';
import * as _ from 'lodash';

@Entity({ name: 'company_preferences' })
export class CompanyPreferencesEntity implements CompanyPreferences {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Exclude()
    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column()
    @IsString()
    @Length(COMPANY_PREFERENCES_TITLE_MIN_LENGTH, COMPANY_PREFERENCES_TITLE_MAX_LENGTH)
    public title: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public ceo: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public inn: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public kpp: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public ogrn: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public name: string;

    @Column({ name: 'name_short' })
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public nameShort: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public address: string;

    @Column()
    @IsDate()
    public founded: Date;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_PICTURE_MAX_LENGTH)
    public picture: string;

    @Column()
    @IsString()
    @Length(COMPANY_PREFERENCES_DESCRIPTION_MIN_LENGTH, COMPANY_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public description: string;

    @Column()
    @IsString()
    @MaxLength(COMPANY_PREFERENCES_CITY_MAX_LENGTH)
    public city: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(COMPANY_PREFERENCES_PHONE_MAX_LENGTH)
    public phone?: string;

    @Column({ nullable: true })
    @IsEmail()
    @IsOptional()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public email?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(COMPANY_PREFERENCES_WEBSITE_MAX_LENGTH)
    public website?: string;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public latitude?: number;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public longitude?: number;

    @Column({ name: 'address_post' })
    @IsString()
    @IsOptional()
    @MaxLength(COMPANY_PREFERENCES_STRING_MAX_LENGTH)
    public addressPost?: string;

    @Exclude()
    @OneToOne(() => CompanyEntity, company => company.preferences)
    @JoinColumn({ name: 'company_id' })
    @Type(() => CompanyEntity)
    public company: CompanyEntity;
}
