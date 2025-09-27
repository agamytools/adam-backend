import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationErrorDto } from '../dto/validation-error.dto';
import { ValidationAppException } from '../exception/validation-app.exception';

export const validatorPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  stopAtFirstError: false,
  exceptionFactory: function (validationErrors: ValidationError[]) {
    // Use Map to collect messages for each property
    const errorMap = new Map<string, string[]>();

    function parseErrors(error: ValidationError) {
      if (error.children && error.children.length > 0) {
        for (const child of error.children) {
          parseErrors(child);
        }
      }

      const constraints = Object.values(error.constraints || {});
      for (const message of constraints) {
        try {
          const parsed = JSON.parse(message);
          const msg = !parsed && typeof parsed !== 'object' ? message : parsed;

          if (!errorMap.has(error.property)) {
            errorMap.set(error.property, []);
          }
          errorMap.get(error.property)?.push(msg);
        } catch (e) {
          if (!errorMap.has(error.property)) {
            errorMap.set(error.property, []);
          }

          const msgParts = message.split('|');
          let translatedMessage = '';
          if (msgParts.length === 1) {
            translatedMessage = msgParts[0] as string;
          } else {
            const args = JSON.parse(msgParts[1]);
            if (!args.hasOwnProperty('property')) {
              args['property'] = error.property;
            }
            translatedMessage = msgParts[0] as string;
          }

          errorMap.get(error.property)?.push(translatedMessage);
        }
      }
    }

    validationErrors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        for (const child of error.children) {
          parseErrors(child);
        }
      } else {
        parseErrors(error);
      }
    });

    // Convert Map to an array with combined messages
    const errors: ValidationErrorDto[] = Array.from(errorMap).map(
      ([property, messages]) => ({
        key: property,
        message: messages.join(', '),
      }),
    );

    throw new ValidationAppException({
      errors: errors,
    });
  },
});
