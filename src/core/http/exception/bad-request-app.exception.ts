import { AppExceptionParams, BaseAppException } from './base-app.exception';
import { HttpStatus } from '@nestjs/common';
import { HttpCodeConst } from '../const/http-code.const';

export class BadRequestAppException extends BaseAppException {
  constructor(params: AppExceptionParams) {
    params.status = params.status ?? HttpStatus.BAD_REQUEST;
    params.code = params.code ?? HttpCodeConst.BAD_REQUEST;
    params.translateMessage = params.translateMessage ?? true;
    params.message = params.message ?? 'general.BAD_REQUEST';
    super(params);
  }
}
