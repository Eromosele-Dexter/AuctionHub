import { IsInt, IsNotEmpty } from "class-validator";

export class WatchlistItem {
    // @IsInt()
    // _id: number;

    @IsInt()
    @IsNotEmpty()
    watchListId: number;

    @IsInt()
    @IsNotEmpty()
    auctionItemId: number;
}
