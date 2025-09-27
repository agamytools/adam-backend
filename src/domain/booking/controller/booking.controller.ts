import {Body, Controller, Post} from "@nestjs/common";
import {BookingService} from "../service/booking.service";
import {CreateCustomerBookingRequestDto} from "../dto/create-customer-booking-request.dto";

@Controller('/api/v1/bookings')
export class BookingController {

    constructor(
        private readonly bookingService: BookingService
    ) {

    }

    @Post('/booking-request')
    async createBookingRequest(
        @Body() createBookingRequestDto: CreateCustomerBookingRequestDto
    ) {
        return this.bookingService.createBookingRequest(createBookingRequestDto);
    }
}
