import {Module} from '@nestjs/common';
import {DatabaseModule} from './core/database/database.module';
import {BookingModule} from "./domain/booking/booking.module";
import {TechnicianModule} from "./domain/technician/technician.module";
import {APP_FILTER, APP_INTERCEPTOR} from "@nestjs/core";
import {HttpExceptionFilter} from "./core/http/exception-filter/http-exception.filter";
import {RequestInterceptor} from "./core/http/interceptor/request.interceptor";

@Module({
    imports: [DatabaseModule, BookingModule, TechnicianModule],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestInterceptor,
        },
    ],
})
export class AppModule {
}
