import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import RequestValidator from "../../core/RequestValidator";
import Movie from "../../models/Movie";

interface IId {
  id: string;
  message: string;
  valid: boolean;
}

export default class ShowManyMovieRequest extends RequestValidator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[] = [
      check("ids")
        .exists({ checkFalsy: true })
        .withMessage("ids is required")
        .bail()
        .isArray({ min: 1 })
        .withMessage("ids should be array and minimum 1 data")
        .bail()
        .custom(async (ids, { req }) => {
          let data: IId = {
            id: "",
            message: "",
            valid: true,
          };

          const unique: boolean = new Set(ids).size === ids.length;

          if (!unique) {
            return Promise.reject("ids in the array must be unique.");
          }

          for (let i = 0; i < ids.length; i++) {
            data.id = ids[i];
            const is_valid = Types.ObjectId.isValid(data?.id);

            if (!is_valid) {
              data = {
                ...data,
                valid: false,
                message: `id ${data.id} is not a valid ObjectId.`,
              };
              break;
            }

            const movie = await Movie.exists({ _id: data.id }).exec();

            if (!movie) {
              data = {
                ...data,
                valid: false,
                message: `id ${data.id} is not exist in database.`,
              };
              break;
            }
          }

          if (!data.valid) {
            return Promise.reject(data.message);
          }
        }),
    ];

    return super.validation(req, res, next, validations);
  }
}
