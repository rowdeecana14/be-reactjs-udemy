import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData, Result, ValidationError } from "express-validator";
import { StatusCodes } from "http-status-codes";

export default class ValidatorHelper {
  public static validation(
    req: Request,
    res: Response,
    next: NextFunction,
    validations: any[]
  ): void {
    Promise.all(validations.map((validation) => validation.run(req))).then(() => {
      const errors = ValidatorHelper.errors(req);

      if (errors.isEmpty()) {
        (req as any).validated = matchedData(req, {
          includeOptionals: false,
        });
        return next();
      }

      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Validation Errors",
        errors: errors.array(),
      });
    });
  }

  private static errors(req: Request) {
    const result: Result<ValidationError> = validationResult(req);

    return result.formatWith((error: any) => {
      return { [error.path]: error.msg };
    });
  }

  static validated(req: Request) {
    return matchedData(req, { includeOptionals: false });
  }
}
