import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
@Entity()
export class Course{
@PrimaryGeneratedColumn()
id:number;

@Column()
instructorId: number;

@Column()
title:string;

@Column()
description:string;

@Column({ type: 'numeric', precision: 10, scale: 2 }) 
price: number;

@Column()
category:string;

@Column({nullable:true})
videoUrl:string;

@Column('text', { array: true, default: [] })
materials:string[];

@CreateDateColumn()
createdAt:Date;

@UpdateDateColumn()
updatedAt:Date;

}