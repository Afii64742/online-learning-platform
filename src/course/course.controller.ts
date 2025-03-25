import { Controller, Post, Body, Get, Put, Param,Query, Request, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from 'src/DTOs/create-course-dto';
import { UpdateCourseDto } from 'src/DTOs/update-course-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { FileInterceptor,FilesInterceptor,AnyFilesInterceptor  } from '@nestjs/platform-express';
import { S3Service } from 'src/services/s3.service';
import { title } from 'process';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService, private readonly s3Service: S3Service) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('instructor')
@Post('create')
@UseInterceptors(AnyFilesInterceptor())  // ✅ Handles both video and materials
async createCourse(
    @Body() createCourseDto: CreateCourseDto, 
    @UploadedFiles() files: Express.Multer.File[],  // ✅ Get all uploaded files as an array
    @Request() req
) {
    try {
        createCourseDto.instructorId = req.user.userId;
        
        // Extract video and materials from files array
        let videoFile: Express.Multer.File | undefined;
        let materialFiles: Express.Multer.File[] = [];

        files.forEach(file => {
            if (file.fieldname === 'video') {
                videoFile = file; // Single video file
            } else if (file.fieldname === 'materials') {
                materialFiles.push(file); // Multiple material files
            }
        });

        // ✅ Upload video to S3
        if (videoFile) {
            const videoUrl = await this.s3Service.uploadFile(videoFile, 'course-videos');
            createCourseDto.videoUrl = videoUrl;
        }

        // ✅ Upload materials to S3
        if (materialFiles.length > 0) {
            createCourseDto.materials = await Promise.all(
                materialFiles.map(file => this.s3Service.uploadFile(file, 'course-materials'))
            );
        }

        const course = await this.courseService.createCourse(createCourseDto);
        return course;
    } catch (error) {
        throw new Error(error.message);
    }
}

    

    // ✅ Get All Courses
    @Get('all')
    async getAllCourses() {
        return await this.courseService.getAllCourses();
    }

    // ✅ Get Course by ID
    @Get('find/:id')
    async searchCourseById(@Param('id') id: number) {
        return await this.courseService.getCourseById(id);
    }

    //SEARCH COURSE BY TITLE    
    @Get('search')
          async searchCourseByTitle(@Query('title') title: string) {
          return await this.courseService.getCourseByTitle(title);
     }

    // ✅ Update Course with File Upload
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('instructor')
    @Put('update/:id')
    @UseInterceptors(AnyFilesInterceptor())  // ✅ Handles both video and materials
    async updateCourse(
        @Param('id') id: number, 
        @Body() updateCourseDto: UpdateCourseDto, 
        @UploadedFiles() files: Express.Multer.File[],  // ✅ Get all uploaded files as an array
        @Request() req
    ) {
        try {
            const instructorId = req.user.userId;

               // Extract video and materials from files array
        let videoFile: Express.Multer.File | undefined;
        let materialFiles: Express.Multer.File[] = [];

        files.forEach(file => {
            if (file.fieldname === 'video') {
                videoFile = file; // Single video file
            } else if (file.fieldname === 'materials') {
                materialFiles.push(file); // Multiple material files
            }
        });

        // ✅ Upload video to S3
        if (videoFile) {
            const videoUrl = await this.s3Service.uploadFile(videoFile, 'course-videos');
            updateCourseDto.videoUrl = videoUrl;
        }

        // ✅ Upload materials to S3
        if (materialFiles.length > 0) {
            updateCourseDto.materials = await Promise.all(
                materialFiles.map(file => this.s3Service.uploadFile(file, 'course-materials'))
            );
        }

            return await this.courseService.updateCourse(id, updateCourseDto, instructorId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // ✅ Delete Course
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'instructor')
    @Delete('delete/:id')
    async deleteCourse(@Param('id') id: number) {
        return await this.courseService.deleteCourse(id);
    }
}
