import { StatusCodes } from "http-status-codes";
import { Request, Response } from "../core/Express";
import Pagination from "../core/Pagination";
import Controller from "../core/Controller";

export default class UserController extends Controller {
  // @desc    List of users
  // @route   GET /v1/api/users
  // @access  Public
  public static async all(req: Request, res: Response) {

  }
}
