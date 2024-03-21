import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { environment } from 'src/main/config/environment/environment';

const getMessageException = (exceptionResp: any) => {
  if (typeof exceptionResp === 'string') return exceptionResp;
  if (exceptionResp?.response) return exceptionResp?.response?.message;
  if (exceptionResp?.message) return exceptionResp?.message;
  return 'Internal Server Error';
};

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResp: any = exception?.getResponse
      ? exception?.getResponse()
      : 'Internal Server Error';
    const exceptionStatus = exception?.getStatus ? exception.getStatus() : 500;
    response.status(exceptionStatus).json({
      response: {
        message: exceptionResp
          ? getMessageException(exceptionResp)
          : exceptionResp,
        statusCode: exceptionStatus,
        timestamp: new Date().toISOString(),
        path: request.url,
        name:
          environment.app.env === 'prd' && exception?.name
            ? 'Not informed'
            : exception?.name
            ? exception.name
            : 'Not informed',
        stack:
          environment.app.env === 'prd' && exception?.stack
            ? 'Not informed'
            : exception?.stack
            ? exception.stack
            : 'Not informed',
      },
    });
  }
}
