import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Refresh } from "../auth/refresh.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    avatar: string;

    @Column({ default: false })
    isVerified: boolean;

    @OneToOne(() => Refresh)
    @JoinColumn()
    refresh: Refresh;
}