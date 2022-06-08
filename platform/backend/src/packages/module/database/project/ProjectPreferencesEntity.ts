import { IGeo } from '@project/common/platform/geo';
import {
    ProjectPreferences,
    PROJECT_PREFERENCES_TITLE_MIN_LENGTH,
    PROJECT_PREFERENCES_TITLE_MAX_LENGTH,
    PROJECT_PREFERENCES_TAGS_MAX_LENGTH,
    PROJECT_PREFERENCES_STRING_MAX_LENGTH,
    PROJECT_PREFERENCES_PICTURE_MAX_LENGTH,
    PROJECT_PREFERENCES_LOCATION_MAX_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_MIN_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_MAX_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_SHORT_MIN_LENGTH,
    PROJECT_PREFERENCES_DESCRIPTION_SHORT_MAX_LENGTH,
    ProjectTag,
} from '@project/common/platform/project';
import { TypeormDecimalTransformer } from '@ts-core/backend/database/typeorm';
import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { Exclude } from 'class-transformer';
import { Length, IsEnum, MaxLength, IsNumber, IsOptional, IsString } from 'class-validator';
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

    /*
    @Column({ array: true, type: 'varchar' })
    @IsEnum(ProjectTag, { each: true })
    @MaxLength(PROJECT_PREFERENCES_TAGS_MAX_LENGTH, { each: true })
    public tags?: Array<ProjectTag>;
    */
   
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(PROJECT_PREFERENCES_PICTURE_MAX_LENGTH)
    public picture?: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @MaxLength(PROJECT_PREFERENCES_LOCATION_MAX_LENGTH)
    public location?: string;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public latitude?: number;

    @Column({ nullable: true, type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsNumber()
    @IsOptional()
    public longitude?: number;

    @Exclude()
    @OneToOne(
        () => ProjectEntity,
        project => project.preferences
    )
    @JoinColumn({ name: 'project_id' })
    public project: ProjectEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(data?: Partial<ProjectPreferences>) {
        if (!_.isNil(data)) {
            this.update(data);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<ProjectPreferences>): void {
        ObjectUtil.copyProperties(data, this);
    }

    public toObject(): ProjectPreferences {
        return TransformUtil.fromClass<ProjectPreferences>(this, { excludePrefixes: ['__'] });
    }

    public toGeo(): IGeo {
        if (_.isNil(this.location) || _.isNil(this.latitude) || _.isNil(this.longitude)) {
            return null;
        }
        return {
            location: this.location, latitude: this.latitude, longitude: this.longitude
        };
    }
}
