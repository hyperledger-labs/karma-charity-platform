import { IsEnum, IsDate, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

export enum UserHashStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    REDEEMED = 'REDEEMED',
}

export enum UserHashType {
    TWOFA = 'TWOFA',
    INVITE = 'INVITE',
    PASSWORD = 'PASSWORD',
}

@Entity({ name: 'user_hash' })
export class UserHashEntity {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public hash: string;

    @IsEnum(UserHashType)
    @Column({ type: 'varchar' })
    public type: UserHashType;
    
    @IsEnum(UserHashStatus)
    @Column({ type: 'varchar' })
    public status: UserHashStatus;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @IsOptional()
    @IsDate()
    @Column({ name: 'expired_date', nullable: true })
    public expiredDate?: Date;

    @ManyToOne(() => UserEntity, user => user.hashes)
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(() => UserEntity, user => user.hashes)
    @JoinColumn({ name: 'initiator_id' })
    public initiator: UserEntity;
}
