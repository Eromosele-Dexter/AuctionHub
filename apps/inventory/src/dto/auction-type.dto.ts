import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class AuctionTypeDto {
    // @IsInt()
    // _id: number;

    @IsString()
    @IsNotEmpty()
    auctionTypeName: string;
}
