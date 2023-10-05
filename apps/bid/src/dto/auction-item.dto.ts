import { IsNotEmpty, IsInt, IsNumber, IsOptional } from "class-validator";

export class AuctionItemDto {
    // @IsInt()
    // _id: number;

    @IsInt()
    @IsNotEmpty()
    itemId: number;

    @IsInt()
    @IsNotEmpty()
    auctionTypeId: number;

    @IsNumber()
    @IsNotEmpty()
    startingBidPrice: number;

    @IsNotEmpty()
    duration: number;

    @IsOptional()
    @IsInt()
    currentBidPrice?: number;

    @IsOptional()
    @IsInt()
    decrementAmount?: number;
}
