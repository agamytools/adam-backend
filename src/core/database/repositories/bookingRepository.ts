import {BaseRepository} from './base.repository';
import {Injectable} from '@nestjs/common';
import {Booking} from "../models/booking.model";

@Injectable()
export class BookingRepository extends BaseRepository<Booking> {
  constructor() {
    super(Booking);
  }
}
