import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ROLES {
    ADMIN = 'ADMIN',
    USER = 'USER',
    MOD = 'MOD'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;
    
    @Column()
    @Exclude()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({default: ROLES.USER})
    @Exclude()
    role: ROLES;
}