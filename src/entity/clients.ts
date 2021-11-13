import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Accidents } from "./accidents";

@Entity()
export class Clients {
  constructor(cnh: number, name: string) {
    this.cnh = cnh;
    this.name = name;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  cnh: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Accidents, (accident) => accident.client)
  accidents: Accidents[];
}
