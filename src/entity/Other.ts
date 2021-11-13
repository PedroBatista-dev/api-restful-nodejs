import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Other {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnh: number;

  @Column()
  name: string;
}
