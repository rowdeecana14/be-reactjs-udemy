import { check, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Types } from 'mongoose';
import Validator from "../../core/Validator";
import Movie from "../../models/Movie";
import { ACTIONS } from "../../utils/enums/ControllerEnum";

export default class ShowMovieRequest extends Validator {
  public static async validate(req: Request, res: Response, next: NextFunction) {
    const validations: ValidationChain[]  = [
      check("id")
        .exists({ checkFalsy: true })
        .withMessage("id is required")
        .bail()
        .isString()
        .withMessage("id should be integer")
        .bail()
        .custom(async (id, { req }) => {
          const validId = Types.ObjectId.isValid(id);

          if(!validId) {
            return Promise.reject(`id is not a valid ObjectId.`);
          }
          
          const movie = await Movie.exists({_id: id, action: { $ne: ACTIONS.Deleted } }).exec();

          if (!movie) {
            return Promise.reject(`Movie with the id not exists.`);
          }
        }),
    ];

    return super.validation(req, res, next, validations);
  }
}
