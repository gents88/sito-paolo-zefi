import { IsNotEmpty, IsOptional, IsString, IsArray, IsEnum } from 'class-validator';

export enum StatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  subtitle?: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @IsOptional()
  categoryId?: string;
}
