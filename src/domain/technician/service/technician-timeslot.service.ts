import {Injectable} from "@nestjs/common";
import {CreateTechnicianTimeslotDto} from "../dto/create-technician-timeslot.dto";
import {TechnicianTimeslotRepository} from "../../../core/database/repositories/technician-timeslot.repository";
import {BadRequestAppException} from "../../../core/http/exception/bad-request-app.exception";
import { Op } from "sequelize";

@Injectable()
export class TechnicianTimeslotService {
    constructor(
        private readonly technicianTimeSlotRepository: TechnicianTimeslotRepository
    ) {
    }

    async createTimeSlots(timeSlotDto: CreateTechnicianTimeslotDto) {
        // 1- make sure the technician does not have overlapping timeslots
        const existingSlot = await this.technicianTimeSlotRepository.findOne({
            where: {
                technicianId: timeSlotDto.technicianId,
                [Op.or]: [
                    // Overlapping cases
                    {
                        startTime: {[Op.lt]: timeSlotDto.endTime},
                        endTime: {[Op.gt]: timeSlotDto.startTime}
                    },
                    // Exact same start time
                    {startTime: timeSlotDto.startTime},
                    // Exact same end time
                    {endTime: timeSlotDto.endTime},
                    // The New slot completely contains existing slot
                    {
                        startTime: {[Op.gte]: timeSlotDto.startTime},
                        endTime: {[Op.lte]: timeSlotDto.endTime}
                    }
                ]
            },
        });
        if (existingSlot) {
            throw new BadRequestAppException({
                message: 'Technician has overlapping timeslots',
            });
        }
        // 2- create the timeslots
        return this.technicianTimeSlotRepository.create(timeSlotDto);
    }

    getAvailableTimeSlots(technicianId: number, lastId: number, limit: number) {
        return this.technicianTimeSlotRepository.findAll({
            where: {
                technicianId,
                id: {[Op.gt]: lastId}
            },
            order: [['id', 'ASC']],
            limit,
        });
    }
}
