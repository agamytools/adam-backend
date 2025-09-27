import { AppExceptionParams, BaseAppException } from './base-app.exception';
import { HttpStatus } from '@nestjs/common';
import { HttpCodeConst } from '../const/http-code.const';

export class ServerAppException extends BaseAppException {
  constructor(params: AppExceptionParams) {
    params.status = params.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    params.code = params.code ?? HttpCodeConst.INTERNAL_SERVER_ERROR;
    params.translateMessage = params.translateMessage ?? true;
    params.message = params.message ?? 'general.INTERNAL_SERVER_ERROR';
    super(params);
  }
}
