import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsUrl, IsBoolean } from 'class-validator';

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
  @IsString({ each: true })
  materials?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];  // 🔹 Tags for better search & recommendations

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;  // 🔹 If course is free or paid
}
