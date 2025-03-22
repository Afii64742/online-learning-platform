import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/modals/Course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // Registering Course entity
  controllers: [CourseController], // Declaring the controller
  providers: [CourseService], // Declaring the service
  exports: [CourseService] // Exporting for use in other modules if needed
})
export class CourseModule {}
