import { Module } from '@nestjs/common';
import {TechnicianController} from "./controller/technician.controller";
import {TechnicianTimeslotService} from "./service/technician-timeslot.service";
import {DatabaseModule} from "../../core/database/database.module";

@Module({
    imports:[DatabaseModule],
    controllers: [TechnicianController],
    providers: [TechnicianTimeslotService],
})
export class TechnicianModule {}
