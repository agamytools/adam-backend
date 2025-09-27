import {Body, Controller, Get, ParseIntPipe, Post, Query} from '@nestjs/common';
import {CreateTechnicianTimeslotDto} from "../dto/create-technician-timeslot.dto";
import {TechnicianTimeslotService} from "../service/technician-timeslot.service";

@Controller('/api/v1/technicians')
export class TechnicianController {
    constructor(
        private readonly technicianTimeSlotService: TechnicianTimeslotService
    ) {
    }


    @Post('/timeslots/availability')
    createTimeSlots(
        @Body() createTechnicianTimeSlotDto: CreateTechnicianTimeslotDto
    ) {
        return this.technicianTimeSlotService.createTimeSlots(createTechnicianTimeSlotDto);
    }

    @Get('/timeslots/availability')
    getAvailableTimeSlots( // use pagination with lastId and limit (Cursor Pagination)
        @Query('technicianId',ParseIntPipe) technicianId: number,
        @Query('lastId',ParseIntPipe) lastId: number,
        @Query('limit',ParseIntPipe) limit: number
    ) {
        return this.technicianTimeSlotService.getAvailableTimeSlots(technicianId, lastId, limit);
    }
}
