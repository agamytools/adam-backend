import {IsDate, IsInt} from "class-validator";
import {Transform} from "class-transformer";

export class CreateTechnicianTimeslotDto {
    @IsInt()
    technicianId: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    startTime: Date;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    endTime: Date;
}
