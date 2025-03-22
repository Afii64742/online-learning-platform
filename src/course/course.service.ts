import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/modals/Course.entity';
import { CreateCourseDto } from 'src/DTOs/create-course-dto';
import { UpdateCourseDto } from 'src/DTOs/update-course-dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    // ✅ CREATE COURSE
    async createCourse(createCourseDto: CreateCourseDto) {
       
        try {
            const course = this.courseRepository.create(createCourseDto);
       
            
            const savedCourse = await this.courseRepository.save(course);
            
            
            return {
                message: 'Course created successfully',
                course: savedCourse
            };
        } catch (error) {
            console.error("Error saving course:", error); 
            throw new InternalServerErrorException('Failed to create course');
        }
    }
    

    // ✅ GET ALL COURSES
    async getAllCourses() {
        try {
            const courses = await this.courseRepository.find();
            return {
                message: 'Courses retrieved successfully',
                count: courses.length,
                courses
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve courses');
        }
    }

    // ✅ GET COURSE BY ID
    async getCourseById(id: number) {
        try {
            const course = await this.courseRepository.findOne({ where: { id } });

            if (!course) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }

            return {
                message: 'Course retrieved successfully',
                course
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve course');
        }
    }

    // ✅ UPDATE COURSE
    async updateCourse(id: number, updateCourseDto: UpdateCourseDto, instructorId: number) {
        try {
            const course = await this.courseRepository.findOne({ where: { id } });

            if (!course) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }

             // 🚨 Check if the instructor updating is the owner
        if (course.instructorId !== instructorId) {
            throw new ForbiddenException("You can only update your own courses.");
        }

            // Update only the fields that are provided
            Object.assign(course, updateCourseDto);

            const updatedCourse = await this.courseRepository.save(course);
            return {
                message: 'Course updated successfully',
                updatedCourse
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to update course');
        }
    }

    // ✅ DELETE COURSE
    async deleteCourse(id: number) {
        try {
            const course = await this.courseRepository.findOne({ where: { id } });

            if (!course) {
                throw new NotFoundException(`Course with ID ${id} not found`);
            }

            await this.courseRepository.remove(course);
            return {
                message: `Course with ID ${id} deleted successfully`
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete course');
        }
    }
}
