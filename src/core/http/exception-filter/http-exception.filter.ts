import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpResponseService } from '../response/http-response.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    // 1- get request info
    const httpResponseService: HttpResponseService = new HttpResponseService();
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const lang = request.headers['accept-language'] || 'en';
    const requestId = request.headers['x-request-id'] || '';

    // 2- get response object
    const response = ctx.getResponse<Response>();

    // 3- build response body
    const resBody = httpResponseService.setException(exception, lang).build();

    response.header('x-request-id', requestId);
    response.header('x-timestamp', new Date().toISOString());

    return response.status(resBody.status).json(resBody);
  }
}
