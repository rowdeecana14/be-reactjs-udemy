import { StatusCodes } from "http-status-codes";
import { User, Role } from "../models/Model";

export default class RolesMiddleware {
  static handle(roles) {
    return async (req, res, next) => {
      const user = await User.scope("roles").findOne({
        where: {
          id: req.auth.id,
        },
      });

      req.auth.roles = user.roles;

      if (!req.auth.roles.some((role) => roles.includes(role.code))) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Unauthorized role",
        });
      }

      next();
    };
  }
}
