// create-product.dto.ts
import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2, { message: 'Informe um nome com pelo menos 2 caracteres' })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'price deve ser maior que zero' })
  price: number;

  @IsInt()
  @Min(0, { message: 'stock não pode ser negativo' })
  stock: number;
}