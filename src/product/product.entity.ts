import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product'})
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 500})
    name!: string;

    @Column({ nullable: true})
    description!: string;
}