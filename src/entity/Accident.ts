import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Client } from "./Client";
import { Other } from "./Other";

@Entity()
export class Accident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  veiculo: string;

  @ManyToOne(() => Client, (client) => client.accidents)
  client: Client;

  @ManyToMany(() => Other)
  @JoinTable()
  others: Other[];
}
