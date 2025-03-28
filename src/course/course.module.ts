import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/modals/Course.entity';
import {Review} from 'src/modals/Review.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { S3Service } from 'src/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Review])], // Registering  entities
  controllers: [CourseController], // Declaring the controller
  providers: [CourseService, S3Service], // Declaring the service
  exports: [CourseService] // Exporting for use in other modules if needed
})
export class CourseModule {}
