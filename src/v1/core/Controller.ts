import { MODULES, ACTIONS } from "../utils/enums/LogEnum";
import { ACTIONS as C_ACTIONS } from "../utils/enums/ControllerEnum";
import { Request } from "./Express";
import Log from "../models/Log";
import User from "../models/User";

export default class Controller {
  private static admin_id = "6504707226803e38164b1d4d";

  public static async log(
    req: Request,
    module: MODULES,
    action: ACTIONS,
    description: string,
  ) {

    if(!req.auth) {
      req.auth = User.findOne({_id: Controller.admin_id})
        .select(['_id', 'name']).exec();
    }
   
    const { password, confirm_password, ...body } = req.body;
    const insert = {
      user: req.auth.name,
      role: "Admin",
      module: module,
      action: action, 
      description: description,
      payload: {
        query: req.query,
        params: req.params,
        body: body,
      }
    }

    await Log.create(insert);
  }

  public static action(req: Request, action: C_ACTIONS ) {
    const date = Date.now();
    const id = "65083c280210f57fd1be5a09";

    const ACTIONS = {
      Created: {
        action: C_ACTIONS.Created, 
        created_at: date,
        created_by: id
      },
      Updated: {
        action: C_ACTIONS.Updated, 
        updated_at: date,
        updated_by: id
      },
      Deleted: {
        action: C_ACTIONS.Deleted, 
        deleted_at: date,
        deleted_by: id
      }
    };

    return ACTIONS[action];
  }
}
