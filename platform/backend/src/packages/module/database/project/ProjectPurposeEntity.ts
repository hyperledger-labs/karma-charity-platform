import { ObjectUtil, TransformUtil } from '@ts-core/common';
import { Type, Exclude } from 'class-transformer';
import { IsString, IsNumber, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { ProjectEntity } from '../project';
import { ProjectPurpose } from '@project/common/platform/project';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Entity({ name: 'project_purpose' })
export class ProjectPurposeEntity implements ProjectPurpose {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column({ type: 'varchar' })
    @IsString()
    public name: string;

    @Column({ type: 'numeric' })
    @IsString()
    public amount: string;

    public decimals: number;;

    @Column({ type: 'varchar', name: 'coin_id' })
    @IsEnum(LedgerCoinId)
    public coinId: LedgerCoinId;

    @Exclude()
    @Column({ name: 'project_id' })
    @IsNumber()
    @IsOptional()
    public projectId: number;

    @Exclude()
    @ManyToOne(() => ProjectEntity, project => project.purposes)
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "project_id" })
    @Type(() => ProjectEntity)
    public project?: ProjectEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(item?: Partial<ProjectPurpose>) {
        if (!_.isNil(ProjectPurpose)) {
            ObjectUtil.copyPartial(item, this, null, ['id']);
        }
    }

}
