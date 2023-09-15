import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import RequestValidator from "../../core/RequestValidator";

export default class LoginAuthRequest extends RequestValidator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[] = [
      check("username")
        .exists({ checkFalsy: true })
        .withMessage("username is required.")
        .bail()
        .isEmail()
        .withMessage("username should be email."),

      check("password")
        .exists({ checkFalsy: true })
        .withMessage("password is required.")
        .bail()
        .isString()
        .withMessage("password should be string."),
    ];

    return super.validation(req, res, next, validations);
  }
}
