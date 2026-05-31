# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label create-product.dto.ts]
import { IsString, IsNumber, IsPositive, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}