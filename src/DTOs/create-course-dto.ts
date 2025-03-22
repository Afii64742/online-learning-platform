import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;


  @IsNotEmpty()
  @IsNumber()
  instructorId: number; 

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures every element in the array is a string
  materials?: string[];
}
