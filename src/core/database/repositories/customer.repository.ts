import {BaseRepository} from './base.repository';
import {Customer} from '../models/customer.model';
import {Injectable} from '@nestjs/common';
import Transaction from "sequelize/lib/transaction";

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
    constructor() {
        super(Customer);
    }

    async findByPk(id: number, options: { transaction: Transaction , raw:boolean}) {
        return this.model.findByPk(id, options);
    }
}
