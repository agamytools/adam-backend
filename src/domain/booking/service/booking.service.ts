import {Injectable} from "@nestjs/common";
import {CreateCustomerBookingRequestDto} from "../dto/create-customer-booking-request.dto";
import {BookingRepository} from "../../../core/database/repositories/bookingRepository";
import {TechnicianTimeslotRepository} from "../../../core/database/repositories/technician-timeslot.repository";
import Transaction from "sequelize/lib/transaction";
import {BadRequestAppException} from "../../../core/http/exception/bad-request-app.exception";
import {BookingStatus} from "../../../core/const/booking/booking-status.const";
import {CustomerRepository} from "../../../core/database/repositories/customer.repository";
import {TechnicianRepository} from "../../../core/database/repositories/technician.repository";
import {Technician} from "../../../core/database/models/technician.model";
import {Op} from "sequelize";

@Injectable()
export class BookingService {

    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly technicianTimeslotRepository: TechnicianTimeslotRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly technicianRepository: TechnicianRepository,
    ) {

    }

    async createBookingRequest(
        createBookingRequestDto: CreateCustomerBookingRequestDto
    ) {
        // find available timeslot
        const transaction = await this.bookingRepository.model!.sequelize!.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            const timeslot = await this.technicianTimeslotRepository.findOne({
                where: {
                    startTime: {[Op.lte]: createBookingRequestDto.startTime},
                    endTime: {[Op.gte]: createBookingRequestDto.endTime},
                    isBooked: false,
                },
                transaction,
                raw: true,
                lock: transaction.LOCK.UPDATE, // Lock the row for update to prevent selecting the same timeslot by another transaction
            });
            if (!timeslot) {
                // Find the closest available timeslot
                const suggestedTimeslot = await this.findClosestAvailableTimeslot(
                    createBookingRequestDto.startTime,
                    createBookingRequestDto.endTime,
                    transaction
                );
                if (suggestedTimeslot) {
                    await transaction.commit();
                    return {
                        isBooked: false,
                        booking: null,
                        suggestedTimeSlot: suggestedTimeslot,
                    };
                }
                throw new BadRequestAppException({
                    message: 'No available timeslot for the requested time range',
                });
            }

            // create booking
            const customer = await this.customerRepository.findByPk(createBookingRequestDto.customerId, {transaction, raw: true});
            const technician = await this.technicianRepository.findByPk(timeslot.technicianId, {transaction, raw: true});
            const booking = await this.bookingRepository.create({
                customerId: createBookingRequestDto.customerId,
                technicianId: timeslot.technicianId,
                timeSlotId: timeslot.id,
                startTime: createBookingRequestDto.startTime,
                endTime: createBookingRequestDto.endTime,
                status: BookingStatus.PENDING,
                customer: {
                    id: customer!.id,
                    name: customer!.name,
                    email: customer!.email,
                },
                technician: {
                    id: technician!.id,
                    name: technician!.name,
                    email: technician!.email,
                },
                totalAmount: 0,
            }, {transaction});

            await this.technicianTimeslotRepository.update({
                isBooked: true
            }, {
                where: {
                    id: timeslot.id
                },
                transaction
            })
            await transaction.commit();
            return {
                isBooked: true,
                booking,
                suggestedTimeSlot: null,
            };
        } catch (e) {
            await transaction.rollback();
            console.error(e);
            throw e;
        }
    }


    private async findClosestAvailableTimeslot(
        requestedStartTime: Date,
        requestedEndTime: Date,
        transaction: Transaction
    ) {
        const requestedDuration = requestedEndTime.getTime() - requestedStartTime.getTime();

        // Find timeslots that can accommodate the requested duration
        const availableTimeslots = await this.technicianTimeslotRepository.findAll({
            where: {
                // Find slots where the duration between start and end is >= requested duration
                startTime: {$lte: new Date(requestedEndTime.getTime() + 7 * 24 * 60 * 60 * 1000)}, // Within the next 7 days
                endTime: {$gte: new Date(requestedStartTime.getTime() - 7 * 24 * 60 * 60 * 1000)}, // Within the past 7 days
            },
            transaction,
        });

        if (availableTimeslots.length === 0) {
            return null;
        }

        // Filter timeslots that have enough duration and find the closest one
        let closestTimeslot: any = null;
        let minTimeDifference = Infinity;

        for (const timeslot of availableTimeslots) {
            const slotDuration = timeslot.endTime.getTime() - timeslot.startTime.getTime();

            // Check if timeslot has enough duration
            if (slotDuration >= requestedDuration) {
                // Calculate time difference from requested start time
                const timeDifference = Math.abs(timeslot.startTime.getTime() - requestedStartTime.getTime());

                if (timeDifference < minTimeDifference) {
                    minTimeDifference = timeDifference;
                    closestTimeslot = {
                        id: timeslot.id,
                        technicianId: timeslot.technicianId,
                        startTime: timeslot.startTime,
                        endTime: new Date(timeslot.startTime.getTime() + requestedDuration), // Adjust end time to match requested duration
                        availableStartTime: timeslot.startTime,
                        availableEndTime: timeslot.endTime,
                    };
                }
            }
        }

        return closestTimeslot;
    }


    /**
     * After searching using AI , the suggested implementation for intelligent booking:
     * Selection Strategy:
     * Availability Match - Exact time slot availability
     * Experience Level - Senior painters get priority for complex jobs
     * Customer Rating - Higher rated painters preferred
     * Workload Balance - Distribute work evenly among painters
     * Location Proximity - Minimize travel time/cost
     * Specialization Match - Match painter skills to job requirements
     */
    async createBookingRequestIntelligent(
        createBookingRequestDto: CreateCustomerBookingRequestDto
    ) {
        // find available timeslot
        const transaction = await this.bookingRepository.model!.sequelize!.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        });
        try {
            // Find all available timeslots for the requested time range
            const availableTimeslots = await this.technicianTimeslotRepository.findAll({
                where: {
                    startTime: {$lte: createBookingRequestDto.startTime},
                    endTime: {$gte: createBookingRequestDto.endTime},
                },
                raw: true,
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (availableTimeslots.length === 0) {
                // Find the closest available timeslot
                const suggestedTimeslot = await this.findClosestAvailableTimeslot(
                    createBookingRequestDto.startTime,
                    createBookingRequestDto.endTime,
                    transaction
                );
                if (suggestedTimeslot) {
                    await transaction.commit();
                    return {
                        isBooked: false,
                        booking: null,
                        suggestedTimeSlot: suggestedTimeslot,
                    };
                }
                throw new BadRequestAppException({
                    message: 'No available timeslot for the requested time range',
                });
            }

            // Select the best technician/painter from available options
            const bestTimeslot = await this.selectBestPainter(
                availableTimeslots,
                transaction
            );

            // create booking
            const customer = await this.customerRepository.findByPk(createBookingRequestDto.customerId, {transaction, raw: true});
            const technician = await this.technicianRepository.findByPk(bestTimeslot.technicianId, {transaction, raw: true});
            const booking = await this.bookingRepository.create({
                customerId: createBookingRequestDto.customerId,
                technicianId: bestTimeslot.technicianId,
                timeSlotId: bestTimeslot.id,
                startTime: createBookingRequestDto.startTime,
                endTime: createBookingRequestDto.endTime,
                status: BookingStatus.PENDING,
                customer: {
                    id: customer!.id,
                    name: customer!.name,
                    email: customer!.email,
                },
                technician: {
                    id: technician!.id,
                    name: technician!.name,
                    email: technician!.email,
                }
            }, {transaction});

            // update time slot to booked
            await this.technicianTimeslotRepository.update({
                isBooked: true
            }, {
                where: {
                    id: bestTimeslot.id
                },
                transaction
            })
            await transaction.commit();
            return {
                isBooked: true,
                booking,
                suggestedTimeSlot: null,
            };
        } catch (e) {
            await transaction.rollback();
            console.error(e);
            throw e;
        }
    }

    private async selectBestPainter(
        availableTimeslots: any[],
        transaction: Transaction
    ): Promise<any> {
        const painterScores: Array<{ timeslot: any, technician: any, score: number }> = [];

        for (const timeslot of availableTimeslots) {
            const technician = await this.technicianRepository.findByPk(timeslot.technicianId, {
                transaction,
                raw: true
            }) as Technician;

            let score = 0;

            // 1. Experience Level (0-30 points)
            const experienceYears = technician['experienceYears'] || 0;
            score += Math.min(experienceYears * 3, 30);

            // 2. Customer Rating (0-25 points)
            const avgRating = technician.rating || 0;
            score += (avgRating / 5) * 25;

            // 3. Workload Balance (0-20 points) - Favors less busy painters
            const recentBookingsCount = await this.getRecentBookingsCount(technician.id, transaction);
            const maxRecentBookings = 10; // Configurable threshold
            score += Math.max(0, (maxRecentBookings - recentBookingsCount) / maxRecentBookings * 20);

            painterScores.push({
                timeslot,
                technician,
                score
            });
        }

        // Sort by score descending and return the best match
        painterScores.sort((a, b) => b.score - a.score);

        // Log selection reasoning for debugging/analytics
        console.log('Painter selection scores:', painterScores.map(p => ({
            technicianId: p.technician.id,
            name: p.technician.name,
            score: p.score
        })));

        return painterScores[0].timeslot;
    }

    private async getRecentBookingsCount(technicianId: number, transaction: Transaction): Promise<number> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return await this.bookingRepository.count({
            where: {
                technicianId,
                createdAt: {$gte: thirtyDaysAgo}
            },
            transaction
        });
    }

    async getMyBookings(params: { customerId: number; offset: number; limit: number }) {
        const response: any = {
            total: -1,
            records: []
        };
        if (params.offset == 0) {
            // calculate total count only on the first page
            response.total = await this.bookingRepository.count({
                where: {
                    customerId: params.customerId
                }
            });
        }
        // fetch paginated records
        response.records = await this.bookingRepository.findAll({
            where: {
                customerId: params.customerId,
                startTime: {
                    [Op.gte]: new Date() // Only future bookings
                }
            },
            order: [['startTime', 'ASC']],
            offset: params.offset,
            limit: params.limit,
        });
        return response;
    }
}
