import { check, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import RequestValidator from "../../core/RequestValidator";
import Movie from "../../models/Movie";

export default class UpdateManyMovieRequest extends RequestValidator {
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

          for (let i = 0; i < movies.length; i++) {
            const { id, title } = movies[i];

            await check(`movies[${i}].title`)
              .optional({ nullable: true, checkFalsy: true })
              .isString()
              .withMessage("title should be a string")
              .bail()
              .custom(async () => {
                const movie = await Movie.findOne({
                  _id: { $ne: id },
                  title: title,
                })
                .select("_id").exec();

                if (movie) {
                  return Promise.reject("title already exists in database.");
                }
              })
              .run(req);
              validationResult(req);
          }
        }),

      check("movies.*.id")
        .exists({ checkFalsy: true })
        .withMessage("id is required")
        .bail()
        .isString()
        .withMessage("id should be integer")
        .bail()
        .custom(async (id, { req }) => {
          const validId = Types.ObjectId.isValid(id);

          if (!validId) {
            return Promise.reject(`id ${id} is not a valid ObjectId.`);
          }

          const movie = await Movie.exists({ _id: id }).exec();

          if (!movie) {
            return Promise.reject(`id ${id} is not exist in database.`);
          }
        }),

      check("movies.*.title")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("title should be string"),

      check("movies.*.summary")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("summary should be string"),

      check("movies.*.release_at")
        .optional({ nullable: true, checkFalsy: true })
        .isDate()
        .withMessage("release_at should be date"),
    ];

    return super.validation(req, res, next, validations);
  }
}
