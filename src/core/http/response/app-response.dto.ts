import { HttpCodeConst } from '../const/http-code.const';
import { ValidationErrorDto } from '../dto/validation-error.dto';
import { HttpStatusConst } from '../const/http-status.const';

export interface AppResponseDto {
  data: unknown;
  message?: string | null;
  code: HttpCodeConst;
  devMessage?: string | null;
  errors?: ValidationErrorDto[];
  status: HttpStatusConst;
  systemCode?: number;
}
