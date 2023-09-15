import mongoose, { STATES } from "mongoose";
import User from "../models/User";
import PasswordHelper from "../helpers/PasswordHelper";
import TokenHelper from "../helpers/TokenHelper";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "../core/Express";
import Controller from "../core/Controller";
import { MODULES, ACTIONS } from "../utils/enums/LogEnum";
import { STATUSES } from "../utils/enums/UserEnum";
import { TOKENS } from "../utils/enums/TokeEnum";

export default class AuthController extends Controller {
  public static async login(req: Request, res: Response) {
    const user = await User.findOne({
      email: req.validated.username,
      status: [STATUSES.Active, STATUSES.Inactive],
    })
      .select(["_id", "name", "email", "password", "status"])
      .exec();

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid username or password.",
      });
    }

    if (user.status !== STATUSES.Active) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User account is inactive",
      });
    }

    const password_match = await PasswordHelper.verify(req.validated.password, user.password);

    if (!password_match) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid username or password",
      });
    }

    const encode = {
      _id: user._id.toString(),
      name: user.name,
      username: user.name,
    };

    let tokens = {};
    const access = TokenHelper.generate(encode, TOKENS.Access);
    const refresh = TokenHelper.generate(encode, TOKENS.Refresh);
    
    if(access.success && refresh.success) {
      tokens = {
        access: access.token,
        refresh: refresh.token
      }
    }

    super.log(
      req,
      MODULES.Auth,
      ACTIONS.LoggedIn,
      `Logged in a user ${user.name} with id ${user._id}.`
    );

    return res.status(StatusCodes.OK).json({
      data: { tokens },
      message: "Login successfully",
    });
  }

  public static async register(req: Request, res: Response) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const user = await User.create(req.validated);
      super.log(
        req,
        MODULES.Auth,
        ACTIONS.Registered,
        `Registered a user ${user.name} with id ${user._id}.`
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(StatusCodes.OK).json({
        data: {
          _id: user._id,
        },
        message: "Register successfully",
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  public static async logout(req: Request, res: Response) {
    return res.status(StatusCodes.OK).json({
      message: "Logout successfully",
    });
  }
}
