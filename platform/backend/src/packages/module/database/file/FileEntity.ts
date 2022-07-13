import { ObjectUtil, TransformUtil, ValidateUtil } from '@ts-core/common/util';
import { ClassTransformOptions } from 'class-transformer';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn, BeforeUpdate, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { File, FileLinkType } from '@project/common/platform/file';

@Entity({ name: 'file' })
export class FileEntity implements File {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column()
    @IsString()
    public uid: string;

    @Column()
    @IsString()
    public name: string;

    @Column()
    @IsString()
    public path: string;

    @Column()
    @IsNumber()
    public size: number;

    @Column()
    @IsString()
    public type: string;

    @Column({ name: 'link_id' })
    @IsNumber()
    public linkId: number;

    @Column({ name: 'link_type', type: 'varchar' })
    @IsEnum(FileLinkType)
    public linkType: FileLinkType;

    @Column()
    @IsString()
    public mime: string;

    @Column()
    @IsString()
    public extension: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): File {
        return TransformUtil.fromClass<File>(this, options);
    }

    @BeforeUpdate()
    @BeforeInsert()
    public validate(): void {
        ValidateUtil.validate(this);
    }
}
