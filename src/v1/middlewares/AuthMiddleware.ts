import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "../core/Express";
import TokenHelper from "../helpers/TokenHelper";
import { TOKENS } from "../utils/enums/TokeEnum";

export default class AuthMiddleware {
  static handle() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token: any = req.headers?.authorization?.split(" ")[1] || req.query?.token || null;
        const access: any = await TokenHelper.verify(token, TOKENS.Access);

        if (!access.success) {
          return res.status(StatusCodes.FORBIDDEN).json({
            message: "Invalid or expired authorization token",
          });
        }

        req.auth = access.data;
        next();
      } catch (error) {
        console.log(error);
      }
    };
  }
}
