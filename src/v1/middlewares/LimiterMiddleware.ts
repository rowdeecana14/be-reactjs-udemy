import rateLimit from "express-rate-limit";
import LoggerService from "../services/LoggerService";

export default class LimiterMiddleware {
  public static handle() {
    return rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: process.env.REQUEST_LIMITER ? parseInt(process.env.REQUEST_LIMITER) : 5,
      message: {
        message: "Too many login attempts from this IP, please try again after a 60 second pause",
      },
      handler: (req, res, next, options) => {
        LoggerService.log().error(
          `Limiter error: Too Many Requests ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
        );

        return res.status(options.statusCode).send(options.message);
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
  }
}
