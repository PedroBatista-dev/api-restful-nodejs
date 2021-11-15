import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Client } from "./client";
import { Other } from "./other";

@Entity()
export class Accident {
  constructor(car: string, client: Client, others: Other[]) {
    this.car = car;
    this.client = client;
    this.others = others;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  car: string;

  @ManyToOne(() => Client, (client) => client.accidents)
  client: Client;

  @ManyToMany(() => Other)
  @JoinTable()
  others: Other[];
}
