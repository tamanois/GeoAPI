import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Country } from './country.entity';
import { Region } from './region.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  cityAscii?: string;

  @Column({ type: 'bigint', nullable: true })
  population?: number;

  @Column({ type: 'boolean', default: false })
  capital!: boolean;

  @ManyToOne(() => Country)
  country!: Country;

  @ManyToOne(() => Region, { nullable: true })
  region?: Region;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
