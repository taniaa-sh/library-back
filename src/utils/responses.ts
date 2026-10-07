import { Response } from "express";

interface SuccessResponse<T = unknown> {
  status: number;
  success: true;
  data: T;
}

interface ErrorResponse<T = unknown> {
  status: number;
  success: false;
  error: string;
  data: T;
}

const successResponsse = <T = unknown>(
  res: Response,
  statusCode: number = 200,
  data?: T
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    status: statusCode,
    success: true,
    data,
  });
};

const errorResponsse = <T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<ErrorResponse<T>> => {
  console.log({ message, data });

  return res.status(statusCode).json({
    status: statusCode,
    success: false,
    error: message,
    data,
  });
};

export { successResponsse, errorResponsse };