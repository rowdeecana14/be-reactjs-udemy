import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import RequestValidator from "../../core/RequestValidator";

export default class AllMovieRequest extends RequestValidator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[] = [
      check("search").optional({ nullable: true, checkFalsy: true }),

      check("sort_dir")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("Sort directory  should be string")
        .bail()
        .isIn(["ASC", "DESC"])
        .withMessage("Sort directory should be ASC or DESC"),

      check("sort_col")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("Sort column  should be string")
        .bail()
        .isIn(["id", "title", "summary", "release_at"])
        .withMessage("Sort directory should be id, title, summary and release_at"),

      check("limit")
        .optional({ nullable: true, checkFalsy: true })
        .isInt()
        .withMessage("Limit should be integer")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Limit should be greater than zero"),

      check("page")
        .optional({ nullable: true, checkFalsy: true })
        .isInt()
        .withMessage("Page should be integer")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Page should be greater than zero"),
    ];

    return super.validation(req, res, next, validations);
  }
}
