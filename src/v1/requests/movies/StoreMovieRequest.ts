import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import Validator from "../../core/Validator";
import Movie from "../../models/Movie";
import { ACTIONS } from "../../utils/enums/ControllerEnum";

export default class StoreMovieRequest extends Validator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[] = [
      check("title")
        .exists({ checkFalsy: true })
        .withMessage("title is required")
        .bail()
        .isString()
        .withMessage("title should be string")
        .bail()
        .custom(async (title, { req }) => {
          const movie = await Movie.findOne({ title: title, action: { $ne: ACTIONS.Deleted } })
            .select("_id").exec();

          if (movie) {
            return Promise.reject("title already exists in database.");
          }
        }),

      check("summary")
        .exists({ checkFalsy: true })
        .withMessage("summary is required")
        .bail()
        .isString()
        .withMessage("summary should be string"),

      check("url")
        .exists({ checkFalsy: true })
        .withMessage("url is required")
        .bail()
        .isURL()
        .withMessage("url should be valid url"),

      check("release_at")
        .exists({ checkFalsy: true })
        .withMessage("release_at is required")
        .bail()
        .isDate()
        .withMessage("release_at should be date"),
    ];

    return super.validation(req, res, next, validations);
  }
}
