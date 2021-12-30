import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Refresh {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    token: string;
}