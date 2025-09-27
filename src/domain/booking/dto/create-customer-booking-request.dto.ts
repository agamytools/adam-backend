import {IsDate, IsInt} from "class-validator";
import {Transform} from "class-transformer";

export class CreateCustomerBookingRequestDto {

    @IsInt()
    customerId: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    startTime: Date;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    endTime: Date;
}
