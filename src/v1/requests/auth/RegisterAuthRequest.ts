import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import Validator from "../../core/Validator";
import User from "../../models/User";
import { STATUSES } from "../../utils/enums/UserEnum";

export default class RegisterAuthRequest extends Validator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[] = [
      check("name")
        .exists({ checkFalsy: true })
        .withMessage("name is required")
        .bail()
        .isString()
        .withMessage("name should be string.")
        .bail()
        .matches(/^[a-zA-Z ]+$/, "i")
        .withMessage("name only allows [a-zA-Z ] characters.")
        .bail()
        .custom(async (name) => {
          const user = await User.findOne({
            name: name,
            status: [STATUSES.Active, STATUSES.Inactive],
          })
            .select("_id")
            .exec();

          if (user) {
            return Promise.reject("name is already in use.");
          }
        }),

      check("email")
        .exists({ checkFalsy: true })
        .withMessage("email name is required")
        .bail()
        .isEmail()
        .withMessage("email should be valid email.")
        .bail()
        .custom(async (email, { req }) => {
          const user = await User.findOne({
            email: email,
            status: [STATUSES.Active, STATUSES.Inactive],
          })
            .select("_id")
            .exec();

          if (user) {
            return Promise.reject("email is already in use.");
          }
        }),

      check("password")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("password should be string.")
        .bail()
        .isLength({ min: 8 })
        .withMessage("password length must be greater than 8 characters.")
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W]).+$/)
        .withMessage(
          "password should contain at least 1 capital, 1 lowercase, 1 special character, and 1 number."
        ),

      check("confirm_password")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("confirm_password should be string.")
        .bail()
        .custom((confirm_password, { req }) => {
          return confirm_password === req.body.password;
        })
        .withMessage("confirm_password should match to password field."),
    ];

    return super.validation(req, res, next, validations);
  }
}
