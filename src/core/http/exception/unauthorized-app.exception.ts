import { AppExceptionParams, BaseAppException } from './base-app.exception';
import { HttpStatus } from '@nestjs/common';
import { HttpCodeConst } from '../const/http-code.const';

export class UnauthorizedAppException extends BaseAppException {
  constructor(params: AppExceptionParams) {
    params.status = params.status ?? HttpStatus.UNAUTHORIZED;
    params.code = params.code ?? HttpCodeConst.UNAUTHORIZED;
    params.translateMessage = params.translateMessage ?? true;
    params.message = params.message ?? 'general.UNAUTHORIZED';
    super(params);
  }
}
