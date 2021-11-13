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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  veiculo: string;

  @ManyToOne(() => Clients, (client) => client.accidents)
  client: Clients;

  @ManyToMany(() => Others)
  @JoinTable()
  others: Others[];
}
