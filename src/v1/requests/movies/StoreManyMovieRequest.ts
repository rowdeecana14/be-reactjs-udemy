import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import RequestValidator from "../../core/RequestValidator";
import Movie from "../../models/Movie";

export default class StoreManyMovieRequest extends RequestValidator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[] = [
      check("movies")
        .exists({ checkFalsy: true })
        .withMessage("movies is required")
        .bail()
        .isArray({ min: 1 })
        .withMessage("movies should be array and minimum 1 data")
        .bail()
        .custom(async (movies, { req }) => {
          const titles: string[] = movies.map((movie: any) => movie.title);
          const unique: boolean = new Set(titles).size === titles.length;

          if (!unique) {
            return Promise.reject("movies title in the array must be unique.");
          }
        }),

      check("movies.*.title")
        .exists({ checkFalsy: true })
        .withMessage("title is required")
        .bail()
        .isString()
        .withMessage("title should be string")
        .custom(async (title, { req }) => {
          const total: number = await Movie.countDocuments({ title: title }).select("_id").exec();
          // const total: number = await Movie.countDocuments({ title: { $in: titles } }).select("_id").exec();

          if (total > 0) {
            return Promise.reject("title already exists in database.");
          }
        }),

      check("movies.*.summary")
        .exists({ checkFalsy: true })
        .withMessage("summary is required")
        .bail()
        .isString()
        .withMessage("summary should be string"),

      check("movies.*.release_at")
        .exists({ checkFalsy: true })
        .withMessage("release_at is required")
        .bail()
        .isDate()
        .withMessage("release_at should be date"),
    ];

    return super.validation(req, res, next, validations);
  }
}
