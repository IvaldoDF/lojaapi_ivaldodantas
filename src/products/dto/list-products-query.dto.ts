import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice deve ser um número' })
  @Min(0, { message: 'minPrice não pode ser negativo' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice deve ser um número' })
  @Min(0, { message: 'maxPrice não pode ser negativo' })
  maxPrice?: number;
}