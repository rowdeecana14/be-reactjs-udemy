import { MODULES, ACTIONS } from "../utils/enums/LogEnum";
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
}
