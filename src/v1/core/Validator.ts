import { Request, Response, NextFunction } from "express";
import { validationResult, matchedData, Result, ValidationError, ValidationChain } from "express-validator";
import { StatusCodes } from "http-status-codes";

export default class Validator {
  public static validation(
    req: Request,
    res: Response,
    next: NextFunction,
    validations: any[]
  ): void {
    Promise.all(validations.map((validation) => validation.run(req))).then(() => {
      const errors = Validator.errors(req);

      if (errors.isEmpty()) {
        (req as any).validated = Validator.validated(req);
        return next();
      }
      else {
        (req as any).validated = null;
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

  // : Record<string, T>
  static validated<T>(req: Request) {
    const validated = matchedData(req, { includeOptionals: false });

    return Object.entries(validated).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, T>);
  }
}
