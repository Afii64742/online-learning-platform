import { Controller, Post, Body, Get,Put, Param, NotFoundException, Request, Delete, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from 'src/DTOs/create-course-dto';
import { NotFoundError } from 'rxjs';
import { UpdateCourseDto } from 'src/DTOs/update-course-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
@Controller('course')
export class CourseController {
    constructor(private readonly courseService:CourseService){}

    //Create Course
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('instructor')
    @Post('create')
    async createCourse(@Body() createCourseDto: CreateCourseDto,  @Request() req) {
        try {
           
            createCourseDto.instructorId = req.user.userId;
            const course = await this.courseService.createCourse(createCourseDto);
            return course;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    // GET ALL COURSES 

    @Get('all')
    async getAllCourses() {
        try {
            return await this.courseService.getAllCourses(); // ✅ No need for extra wrapping
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    //GET COURSE BY ID

    @Get('find/:id')
    async searchCourseById(@Param('id') id:number){
     try{
      const course = await this.courseService.getCourseById(id);
      return course

     }catch(error){
        throw new InternalServerErrorException(error.message);
     }
    }

     // 🔹 Update Course - Only Instructors can update

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('instructor')
    @Put('update/:id')
    async updateCourse(@Param('id') id:number, @Body() updateCourseDto:UpdateCourseDto,  @Request() req){
        try{
            const instructorId = req.user.userId;
            const updatedCourse = await this.courseService.updateCourse(id, updateCourseDto, instructorId);
             return updatedCourse;
        }catch(error){
            throw new InternalServerErrorException(error.message);
        }
    }


     // 🔹 Delete Course - Only Admins and Instructors can delete

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'instructor')
    @Delete('delete/:id')
    async deleteCourse(@Param('id') id:number){
        try{
            const course = await this.courseService.deleteCourse(id);
            return{
                message: 'Course deleted successfully',
            }
        }catch(error){
            throw new InternalServerErrorException(error.message);
        }
    }
}
