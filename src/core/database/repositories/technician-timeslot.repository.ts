import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { TechnicianTimeSlot } from '../models/technician-timeslot.model';

@Injectable()
export class TechnicianTimeslotRepository extends BaseRepository<TechnicianTimeSlot> {
  constructor() {
    super(TechnicianTimeSlot);
  }
}
