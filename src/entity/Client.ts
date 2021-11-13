import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Accident } from "./Accident";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnh: number;

  @Column()
  name: string;

  @OneToMany(() => Accident, (accident) => accident.client)
  accidents: Accident[];
}
