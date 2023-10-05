import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BidDto {
    // @IsInt()
    // _id: number;

    @IsNotEmpty()
    @IsInt()
    bidderId: number;

    @IsNotEmpty()
    @IsInt()
    itemId: number;

    @IsNotEmpty()
    @IsNumber()
    bidAmount: number;

    @IsNotEmpty()
    createdAt: Date;
}
