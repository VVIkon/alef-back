import { STATUS_CODES } from 'node:http';
import type { Request, Response } from 'express';
import { HttpException, ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status: number = 500;
		let message: string = 'Internal server error';

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = exception.message;
		}
		// Логируем ошибку (опционально)
		console.error(`[${request.method}] ${request.url}`, exception);
		response.status(status).json({
			statusCode: status,
			error: STATUS_CODES[status],
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}
