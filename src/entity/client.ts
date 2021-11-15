import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Accident } from "./accident";

@Entity()
export class Client {
  constructor(cnh: string, name: string) {
    this.cnh = cnh;
    this.name = name;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  cnh: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Accident, (accident) => accident.client)
  accidents: Accident[];
}
