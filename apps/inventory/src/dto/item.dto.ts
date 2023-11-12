import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  seller_id: number;

  @IsNotEmpty()
  image: any;

  @IsNotEmpty()
  dateAdded: number;
}
