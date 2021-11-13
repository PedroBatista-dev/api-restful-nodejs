import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Others {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  cnh: number;

  @Column({ nullable: false })
  name: string;
}
