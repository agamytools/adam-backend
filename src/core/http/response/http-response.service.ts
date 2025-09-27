import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { AppResponseDto } from './app-response.dto';
import { HttpCodeConst } from '../const/http-code.const';
import { HttpStatusConst } from '../const/http-status.const';
import { ValidationErrorDto } from '../dto/validation-error.dto';
import { BaseAppException } from '../exception/base-app.exception';
import { ValidationAppException } from '../exception/validation-app.exception';
import { EnvUtil } from '../../util/env.util';

@Injectable({
  scope: Scope.REQUEST,
})
export class HttpResponseService {
  private readonly response: AppResponseDto;

  constructor() {
    this.response = {
      data: null,
      message: null,
      code: HttpCodeConst.SUCCESS,
      devMessage: null,
      errors: [],
      status: HttpStatusConst.OK,
      systemCode: 0,
    };
  }

  setData(data: unknown): this {
    this.response.data = data;
    return this;
  }

  // TODO we can add translation service here later
  setMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  setCode(code: HttpCodeConst): this {
    this.response.code = code;
    return this;
  }

  setStatus(status: number): this {
    this.response.status = status;
    return this;
  }

  setDevMessage(devMessage: string | null): this {
    this.response.devMessage = devMessage;
    return this;
  }

  setErrors(errors: ValidationErrorDto[]): this {
    this.response.errors = errors;
    return this;
  }

  setException(exception: Error, lang: string): this {
    if (exception instanceof BaseAppException) {
      // app exception

      if (exception instanceof ValidationAppException) {
        this.response.errors = exception.errors ?? [];
      }

      this.response.systemCode = exception.systemCode;
      this.response.status = exception.getStatus();
      this.response.code = exception.code;
      this.response.message = exception.message;

      this.response.devMessage = this.formatExceptionMessage(exception);
    } else {
      const status = exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR;
      this.response.status = status;
      if (status == HttpStatusConst.NOT_FOUND) {
        this.response.code = HttpCodeConst.URL_NOT_FOUND;
        // not found
        this.response.message = 'Not Found';
        this.response.devMessage = this.formatExceptionMessage(exception);
      } else {
        this.response.code = HttpCodeConst.INTERNAL_SERVER_ERROR;
        // server error
        this.response.message = 'Internal Server Error';
        this.response.devMessage = this.formatExceptionMessage(exception);
      }
    }

    return this;
  }

  build(): AppResponseDto {
    if (this.response.errors?.length === 0) {
      delete this.response.errors;
    }
    if (this.response.devMessage === null) {
      delete this.response.devMessage;
    }
    if (!this.response.message) {
      delete this.response.message;
    }
    if (this.response.systemCode === 0) {
      delete this.response.systemCode;
    }
    return this.response;
  }

  getStatus(): number {
    return this.response.status;
  }

  private formatExceptionMessage(exception: Error) {
    if (EnvUtil.isProd()) {
      return null;
    }
    let errorMsg = `name: ${exception.name}, message: ${exception.message}, stack: ${exception.stack}`;
    if (exception['code']) {
      errorMsg += `, code: ${exception['code']}`;
    }
    if (exception['errors']) {
      errorMsg += `, errors: ${JSON.stringify(exception['errors'])}`;
    }
    if (exception['sql']) {
      errorMsg += `, sql: ${exception['sql']}`;
    }
    return errorMsg;
  }
}
