import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {databaseConfig} from '../config/database.config';
import {CustomerRepository} from './repositories/customer.repository';
import {TechnicianRepository} from './repositories/technician.repository';
import {TechnicianTimeslotRepository} from './repositories/technician-timeslot.repository';
import {BookingRepository} from './repositories/bookingRepository';
import {models} from './models';

const repositories = [
    CustomerRepository,
    TechnicianRepository,
    TechnicianTimeslotRepository,
    BookingRepository,
];

@Module({
    imports: [
        SequelizeModule.forRoot({
            ...databaseConfig,
            autoLoadModels: false,
            synchronize: false,
            logging: true,
            models: models,
        }),
    ],
    providers: repositories,
    exports: repositories
})
export class DatabaseModule {
}
