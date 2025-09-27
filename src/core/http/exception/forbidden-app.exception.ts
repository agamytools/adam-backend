import { AppExceptionParams, BaseAppException } from './base-app.exception';
import { HttpStatus } from '@nestjs/common';
import { HttpCodeConst } from '../const/http-code.const';

export class ForbiddenAppException extends BaseAppException {
  constructor(params: AppExceptionParams) {
    params.status = params.status ?? HttpStatus.FORBIDDEN;
    params.code = params.code ?? HttpCodeConst.FORBIDDEN;
    params.translateMessage = params.translateMessage ?? true;
    params.message = params.message ?? 'general.FORBIDDEN';
    super(params);
  }
}
