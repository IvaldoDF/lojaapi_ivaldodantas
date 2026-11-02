import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;
}