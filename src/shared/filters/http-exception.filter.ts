import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { environment } from 'src/main/config/environment/environment';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    exception.getResponse();
    response.status(exception.getStatus() || 500).json({
      response: {
        message: exception.message || 'Internal Server Error',
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        name: exception.name,
        stack: environment.app.env === 'prd' ? null : exception.stack,
      },
    });
  }
}
