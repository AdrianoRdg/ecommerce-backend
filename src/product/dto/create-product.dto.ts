import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  categoryId: number;

  @IsString()
  description: string;

  @MaxLength(500)
  largeDescription: string;

  @IsNumber()
  price: number;

  @IsNumber()
  discountPercent: number | null;

  @IsBoolean()
  isNew: boolean;

  @IsString()
  imageLink: string;

  @IsString()
  otherImagesLink: string;
}
