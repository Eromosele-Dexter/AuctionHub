import { IsInt, IsNotEmpty } from 'class-validator';

export class ItemKeywordDto {
  @IsInt()
  @IsNotEmpty()
  item_id: number;

  @IsInt()
  @IsNotEmpty()
  keywordId: number;
}
