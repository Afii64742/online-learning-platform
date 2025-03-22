import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    STUDENT = 'student',
    INSTRUCTOR = 'instructor',
    ADMIN = 'admin'
  }
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
    role: UserRole;
  }