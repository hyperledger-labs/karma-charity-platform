import { IGeo } from '@project/common/platform/geo';
import {
    ProjectPreferences,
    PROJECT_PREFERENCES_TITLE_MIN_LENGTH,
    PROJECT_PREFERENCES_TITLE_MAX_LENGTH,
    PROJECT_PREFERENCES_TAGS_MAX_LENGTH,
    PROJECT_PREFERENCES_STRING_MAX_LENGTH,
    PROJECT_PREFERENCES_PICTURE_MAX_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH,
    ProjectTag,
    PROJECT_PREFERENCES_CITY_MAX_LENGTH,
} from '@project/common/platform/project';
import { TypeormDecimalTransformer } from '@ts-core/backend';
import { ObjectUtil, TransformUtil } from '@ts-core/common';
import { Exclude, Type } from 'class-transformer';
import { Length, IsEnum, IsDate, IsBoolean, MaxLength, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './ProjectEntity';
import * as _ from 'lodash';

@Entity({ name: 'project_preferences' })
export class ProjectPreferencesEntity implements ProjectPreferences {
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
    @Length(PROJECT_PREFERENCES_TITLE_MIN_LENGTH, PROJECT_PREFERENCES_TITLE_MAX_LENGTH)
    public title: string;

    @Column()
    @IsString()
    @Length(PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH)
    public description: string;

    @Column({ name: 'description_short' })
    @IsString()
    @Length(PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH, PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH)
    public descriptionShort: string;

    @Column({ array: true, type: 'varchar' })
    @IsEnum(ProjectTag, { each: true })
    @IsOptional()
    @MaxLength(PROJECT_PREFERENCES_TAGS_MAX_LENGTH, { each: true })
    public tags?: Array<ProjectTag>;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(PROJECT_PREFERENCES_PICTURE_MAX_LENGTH)
    public picture?: string;

    @Column()
    @IsString()
    @MaxLength(PROJECT_PREFERENCES_CITY_MAX_LENGTH)
    public city: string;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public latitude?: number;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public longitude?: number;

    @Column({ name: 'is_urgent', nullable: true })
    @IsBoolean()
    @IsOptional()
    public isUrgent?: boolean;

    @Column({ name: 'activated_date', nullable: true })
    @IsDate()
    @IsOptional()
    public activatedDate?: Date;

    @Column({ name: 'finished_date', nullable: true })
    @IsDate()
    @IsOptional()
    public finishedDate?: Date;

    @Exclude()
    @OneToOne(
        () => ProjectEntity,
        project => project.preferences
    )
    @JoinColumn({ name: 'project_id' })
    @Type(() => ProjectEntity)
    public project: ProjectEntity;
}
