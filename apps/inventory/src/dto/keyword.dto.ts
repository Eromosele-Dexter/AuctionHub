import { IsNotEmpty, IsString } from 'class-validator';

export class KeywordDto {
    @IsNotEmpty()
    @IsString()
    keywordName: string;
}
