import {IsString, IsNumber, IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
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
