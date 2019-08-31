import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { BaseError, ValidationError } from 'sequelize';
import { Response } from 'express';

@Catch(BaseError, Error)
export class SequelizeExceptionFilter implements ExceptionFilter {
  PreparevalidationError(exception: ValidationError) {
    return { ...exception, stack: undefined, get: undefined };
  }

  defaultResponse(exception: BaseError) {
    return { ...exception, stack: undefined };
  }

  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    if (exception instanceof ValidationError) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(this.defaultResponse(exception));
    } else {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(this.defaultResponse(exception));
    }
  }
}
