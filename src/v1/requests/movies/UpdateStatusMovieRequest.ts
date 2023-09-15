import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Validator from "../../core/Validator";
import Movie from "../../models/Movie";
import { STATUSES } from "../../utils/enums/MovieEnum";

interface IId {
  id: string;
  message: string;
  valid: boolean;
}

export default class UpdateStatusMovieRequest extends Validator {
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

      check("status")
        .exists({ checkFalsy: true })
        .withMessage("status is required")
        .bail()
        .isString()
        .withMessage("status should be string")
        .bail()
        .isIn(Object.values(STATUSES))
        .withMessage(`status should be ${Object.values(STATUSES).join(", ")}`),
    ];

    return super.validation(req, res, next, validations);
  }
}
