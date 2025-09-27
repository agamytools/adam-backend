import { HttpException } from '@nestjs/common';
import { HttpCodeConst } from '../const/http-code.const';
import { ValidationErrorDto } from '../dto/validation-error.dto';

export interface AppExceptionParams {
  message?: string;
  translateMessage?: boolean;
  status?: number;
  code?: HttpCodeConst;
  devMessage?: string;
  systemCode?: number;
  timestamp?: string;
  requestId?: string;
  errors?: ValidationErrorDto[];
}

export class BaseAppException extends HttpException {
  code: HttpCodeConst;
  translateMessage: boolean;
  devMessage?: string;
  systemCode?: number;
  timestamp: string;
  requestId: string;
  errors?: ValidationErrorDto[];

  constructor(params: AppExceptionParams) {
    super(params.message || '', params.status || 500);
    this.translateMessage = params.translateMessage || true;
    this.devMessage = params.devMessage;
    this.code = params.code || HttpCodeConst.INTERNAL_SERVER_ERROR;
    this.systemCode = params.systemCode;
    this.timestamp = params.timestamp || new Date().toISOString();
    this.requestId = params.requestId || '';
    this.errors = params.errors || [];
  }
}
