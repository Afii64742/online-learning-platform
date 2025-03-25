import { IsString, IsNumber, IsOptional, IsArray, IsUrl, IsBoolean } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;

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
  tags?: string[];  // 🔹 Tags

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;  // 🔹 Free or Paid
}
