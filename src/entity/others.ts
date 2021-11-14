import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Others {
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
}
