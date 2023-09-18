import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import LoggerService from "../services/LoggerService";

export default class ErrorsMiddleware {
  public static handle() {
    return async (err: any, req: Request, res: Response, next: NextFunction) => {
      const errors = {
        error: err,
        message: err.message ?? "",
        stack: err.stack ?? "",
      };
      const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

      LoggerService.log().error(`Error exception:`, errors);

      const response = {
        message: "Error exception",
        errors: process.env.NODE_ENV === "production" ? { message: err.message ?? "" } : errors,
      };

      return res.status(statusCode).json(response);
    };
  }
}
