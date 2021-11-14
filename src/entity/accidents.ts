import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Clients } from "./clients";
import { Others } from "./others";

@Entity()
export class Accidents {
  constructor(car: string, client: Clients, others: Others[]) {
    this.car = car;
    this.client = client;
    this.others = others;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  car: string;

  @ManyToOne(() => Clients, (client) => client.accidents)
  client: Clients;

  @ManyToMany(() => Others)
  @JoinTable()
  others: Others[];
}
