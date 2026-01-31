import { Response } from 'express';

interface SuccessResponse {
  success: boolean;
  message: string;
  data: unknown;
  pagination?: unknown;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: unknown;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: unknown = null,
  pagination: unknown = null
) => {
  const response: SuccessResponse = {
    success,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors: unknown = null
) => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
