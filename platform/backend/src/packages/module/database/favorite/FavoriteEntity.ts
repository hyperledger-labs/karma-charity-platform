import { ValidateUtil, TransformUtil } from '@ts-core/common';
import { Exclude, Type, ClassTransformOptions } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, BeforeInsert, BeforeUpdate, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { Favorite, FavoriteObjectType, FavoriteStatus } from '@project/common/platform/favorite';
import { UserEntity } from '@project/module/database/user';
import { ProjectEntity } from '../project';
import { CompanyEntity } from '../company';
import { UserCompany, UserProject } from '@project/common/platform/user';

@Entity({ name: 'favorite' })
export class FavoriteEntity implements Favorite {
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

    @Column({ type: 'varchar' })
    @IsEnum(FavoriteStatus)
    public status: FavoriteStatus;

    @Column({ name: 'object_id' })
    @IsNumber()
    public objectId: number;

    @Exclude()
    @Column({ name: "user_id" })
    @IsOptional()
    @IsNumber()
    public userId: number;

    @Exclude()
    @Column({ name: "project_id" })
    @IsOptional()
    @IsNumber()
    public projectId: number;

    @Exclude()
    @Column({ name: "company_id" })
    @IsOptional()
    @IsNumber()
    public companyId: number;

    @Column({ name: 'object_type', type: 'varchar' })
    @IsEnum(FavoriteObjectType)
    public objectType: FavoriteObjectType;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Exclude()
    @ManyToOne(() => UserEntity, user => user.favorites)
    @ValidateNested()
    @JoinColumn({ name: "user_id" })
    @Type(() => UserEntity)
    public user: UserEntity;

    @Exclude()
    @ManyToOne(() => ProjectEntity, project => project.favorites, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "project_id" })
    @Type(() => ProjectEntity)
    public project?: ProjectEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, company => company.favorites, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    @Type(() => CompanyEntity)
    public company?: CompanyEntity;

    public object: UserProject | UserCompany;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @BeforeUpdate()
    @BeforeInsert()
    public validate(): void {
        ValidateUtil.validate(this);
    }

    public toObject(options?: ClassTransformOptions): Favorite {
        let item = TransformUtil.fromClass<Favorite>(this, options);
        if (!_.isNil(this.project)) {
            item.object = this.project.toUserObject(options);
        }
        else if (!_.isNil(this.company)) {
            item.object = this.company.toUserObject(options);
        }
        return item;
    }
}
