import { StatusCodes } from "http-status-codes";
import LoggerService from "../services/LoggerService";

export default class NotFoundMiddleware {
  static handle(req, res) {
    const host = req.headers.host || "unknown host"; // add a default value for host
    const message = `Cannot ${req.method} ${req.protocol}://${host}${req.originalUrl}`;
    LoggerService.log().error(`Exception error: ${message}`);

    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Error exception",
      error: { error: message },
    });
  }
}
