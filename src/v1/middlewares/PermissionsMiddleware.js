import { StatusCodes } from "http-status-codes";
import { User, Role, Permission } from "../models/Model";

export default class PermissionsMiddleware {
  static handle(permission) {
    return async (req, res, next) => {
      let ids = [];
      let roles = [];
      let is_allowed = false;

      if (req.auth.roles) {
        ids = req.auth.roles.map((role) => role.id);
        roles = await Role.scope("permissions").findAll({
          where: {
            id: ids,
          },
        });
      } else {
        let user = await User.scope("actions", "rolesPermissions").findOne({
          where: { id: req.auth.id },
        });

        roles = user.roles;
      }

      for (let role of roles) {
        for (let permit of role.permissions) {
          if (permission.includes(permit.permission)) {
            is_allowed = true;
            break;
          }
        }

        if (is_allowed) break;
      }

      if (!is_allowed) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Unauthorized permission",
        });
      }

      next();
    };
  }
}
