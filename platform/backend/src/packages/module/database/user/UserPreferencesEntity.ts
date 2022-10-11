import { IGeo } from '@project/common/platform/geo';
import {
    UserPreferences,
    USER_PREFERENCES_NAME_MIN_LENGTH,
    USER_PREFERENCES_NAME_MAX_LENGTH,
    USER_PREFERENCES_DESCRIPTION_MAX_LENGTH,
    USER_PREFERENCES_PHONE_MAX_LENGTH,
    USER_PREFERENCES_STRING_MAX_LENGTH,
    USER_PREFERENCES_PICTURE_MAX_LENGTH,
    USER_PREFERENCES_LOCATION_MAX_LENGTH,
    UserPreferencesProjectCancelStrategy
} from '@project/common/platform/user';
import { TypeormDecimalTransformer } from '@ts-core/backend';
import { ObjectUtil, TransformUtil } from '@ts-core/common';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsDate, IsEnum, Length, IsBoolean, MaxLength, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import * as _ from 'lodash';
import { TransformGroup } from '../TransformGroup';

@Entity({ name: 'user_preferences' })
export class UserPreferencesEntity implements UserPreferences {
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
    @Length(USER_PREFERENCES_NAME_MIN_LENGTH, USER_PREFERENCES_NAME_MAX_LENGTH)
    public name: string;

    @Column({ nullable: true })
    @IsEmail()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_STRING_MAX_LENGTH)
    public email?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_PHONE_MAX_LENGTH)
    public phone?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public description?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public locale?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_PICTURE_MAX_LENGTH)
    public picture?: string;

    @Column({ name: 'is_male', nullable: true })
    @IsBoolean()
    @IsOptional()
    public isMale?: boolean;

    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    public birthday?: Date;

    @Column({ name: 'project_cancel_strategy', nullable: true, type: 'varchar' })
    @IsEnum(UserPreferencesProjectCancelStrategy)
    @IsOptional()
    public projectCancelStrategy?: UserPreferencesProjectCancelStrategy;

    @Column({ name: 'is_need_platform_news', nullable: true })
    @IsBoolean()
    @IsOptional()
    public isNeedPlatformNews?: boolean;

    @Column({ name: 'is_need_platform_notifications', nullable: true })
    @IsBoolean()
    @IsOptional()
    public isNeedPlatformNotifications?: boolean;

    @Column({ name: 'is_need_favorites_notifications', nullable: true })
    @IsBoolean()
    @IsOptional()
    public isNeedFavoritesNotifications?: boolean;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(USER_PREFERENCES_LOCATION_MAX_LENGTH)
    public location?: string;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public latitude?: number;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public longitude?: number;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate?: Date;

    @Exclude()
    @OneToOne(
        () => UserEntity,
        user => user.preferences
    )
    @JoinColumn({ name: 'user_id' })
    @Type(() => UserEntity)
    public user: UserEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toGeo(): IGeo {
        if (_.isNil(this.location) || _.isNil(this.latitude) || _.isNil(this.longitude)) {
            return null;
        }
        return {
            location: this.location, latitude: this.latitude, longitude: this.longitude
        };
    }
}
