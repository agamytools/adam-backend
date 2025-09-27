import {BaseRepository} from './base.repository';
import {Customer} from '../models/customer.model';
import {Injectable} from '@nestjs/common';
import {Technician} from '../models/technician.model';
import Transaction from "sequelize/lib/transaction";

@Injectable()
export class TechnicianRepository extends BaseRepository<Technician> {
    constructor() {
        super(Technician);
    }

    async findByPk(id: number, options: { transaction: Transaction ,raw:boolean}) {
        return this.model.findByPk(id, options);
    }
}
