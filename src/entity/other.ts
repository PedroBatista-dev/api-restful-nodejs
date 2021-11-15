import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Other {
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
}
