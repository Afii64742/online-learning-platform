import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Review } from "./Review.entity";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instructorId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('text', { array: true, default: [] })
  materials: string[];

  @Column('text', { array: true, default: [] })
  tags: string[];  // 🔹 Added for search & recommendations

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 }) 
  rating: number;  // 🔹 Average rating of course

  @Column({ default: 0 })
  enrollments: number;  // 🔹 Number of enrollments

  @Column({ default: false })
  isFree: boolean; // 🔹 Free or Paid course

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[]; // 🔹 Reviews relation

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
