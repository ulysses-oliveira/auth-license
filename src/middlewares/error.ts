// src/middlewares/error.ts

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import { ApiError } from '../utils/ApiError';

/**
 * Converte qualquer erro em ApiError para padronizar o tratamento
 */
export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  // Se não for instância de ApiError, cria um ApiError padrão
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode && typeof error.statusCode === 'number'
        ? error.statusCode
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[String(statusCode) as keyof typeof httpStatus];

    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

/**
 * Middleware global para tratar erros e enviar resposta padronizada
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction // necessário mesmo que não usado para identificar middleware de erro
): void => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response: { code: number; message: string; stack?: string } = {
    code: statusCode,
    message,
  };

  if (config.env === 'development') {
    response.stack = err.stack;
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
