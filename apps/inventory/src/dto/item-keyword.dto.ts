import { IsInt, IsNotEmpty } from 'class-validator';

export class ItemKeywordDto {
    @IsInt()
    @IsNotEmpty()
    itemId: number;

    @IsInt()
    @IsNotEmpty()
    keywordId: number;
}
