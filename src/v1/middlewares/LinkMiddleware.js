import { StatusCodes } from "http-status-codes";
import TokenHelper from "../helpers/TokenHelper";

export default class LinkMiddleware {
  static handle(parameters) {
    return async (req, res, next) => {
      try {
        const token = req.headers?.authorization?.split(" ")[1] || req.query?.token || null;
        const auth = await TokenHelper.verify(token, process.env.TOKEN_LINKS);

        if (!auth.verified) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid or expired authorization token",
          });
        }

        req.auth = auth.decoded;
        next();
      } catch (error) {
        console.log(error);
      }
    };
  }
}
