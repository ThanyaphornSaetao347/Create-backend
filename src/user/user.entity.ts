import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;
}