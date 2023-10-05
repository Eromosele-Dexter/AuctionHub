import { IsInt, IsNotEmpty } from "class-validator";

export class SessionDto {
    // @IsInt()
    // _id: number;

    @IsInt()
    @IsNotEmpty()
    bidderId: number;

    @IsInt()
    @IsNotEmpty()
    itemId: number;

    @IsNotEmpty()
    startTime: Date;
}
