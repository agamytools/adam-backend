import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Response} from 'express';
import {HttpResponseService} from "../response/http-response.service";
import {HttpCodeConst} from "../const/http-code.const";

@Injectable()
export class RequestInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpResponseService: HttpResponseService = new HttpResponseService();

        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((data: unknown): unknown => {
                if (response.headersSent) {
                    // if the response contains a file, skip the interceptor
                    return data;
                }
                if (!data) {
                    response.status(HttpStatus.OK);

                    return httpResponseService
                        .setData(null)
                        .setStatus(HttpStatus.OK)
                        .setCode(HttpCodeConst.SUCCESS)
                        .setDevMessage(null)
                        .setErrors([])
                        .build();
                } else if (this.isBuffer(data)) {
                    response.status(HttpStatus.OK).send(data);
                    return null;
                } else {
                    // Building the response body
                    const resBody = httpResponseService
                        .setData(data)
                        .setStatus(HttpStatus.OK)
                        .setCode(HttpCodeConst.SUCCESS)
                        .setDevMessage(null)
                        .setErrors([]);

                    response.status(resBody.getStatus());

                    return resBody.build();
                }
            }),
        );
    }

    private isBuffer(data: unknown) {
        return (
            Buffer.isBuffer(data) ||
            data instanceof Buffer ||
            data instanceof Uint8Array
        );
    }

}
