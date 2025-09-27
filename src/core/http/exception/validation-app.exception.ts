import { AppExceptionParams, BaseAppException } from './base-app.exception';
import { HttpStatus } from '@nestjs/common';
import { HttpCodeConst } from '../const/http-code.const';

export class ValidationAppException extends BaseAppException {
  constructor(params: AppExceptionParams) {
    params.status = params.status ?? HttpStatus.PRECONDITION_FAILED;
    params.code = params.code ?? HttpCodeConst.VALIDATION_FAILED;
    params.translateMessage = params.translateMessage ?? true;
    params.message = params.message ?? 'general.VALIDATION_ERROR';
    super(params);
  }
}
