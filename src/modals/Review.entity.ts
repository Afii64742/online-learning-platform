import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import {Course} from "./Course.entity";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Course, (course) => course.reviews)
  course: Course;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
