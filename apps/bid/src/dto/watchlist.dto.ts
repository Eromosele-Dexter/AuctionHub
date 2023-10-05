import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class WatchlistDto {
    // @IsInt()
    // _id: number;

    @IsInt()
    @IsNotEmpty()
    bidderId: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
