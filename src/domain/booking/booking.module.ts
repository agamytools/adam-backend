import { Module } from '@nestjs/common';
import {BookingController} from "./controller/booking.controller";
import {BookingService} from "./service/booking.service";
import {DatabaseModule} from "../../core/database/database.module";

@Module({
    imports:[DatabaseModule],
    controllers: [
        BookingController
    ],
    providers: [BookingService],
})
export class BookingModule {}
