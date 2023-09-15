import { createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint, errors, printf } = format;

export default class LoggerService {
  static development() {
    return createLogger({
      level: "debug",

      transports: [
        new transports.File({
          filename: `${process.env.PATH_ERROR}/errors.log`,
          format: combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            errors({ stack: true }),
            printf(({ level, message, timestamp, stack }) => {
              if (stack) {
                return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
              }
              return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
            })
          ),
        }),
      ],
    });
  }

  static production() {
    return createLogger({
      level: "debug",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        printf(({ level, message, timestamp, stack }) => {
          if (stack) {
            return `[${timestamp}] [${level.toUpperCase()}] [${message}] - ${stack}`;
          }
          return `[${timestamp}] [${level.toUpperCase()}] [${message}]`;
        })
      ),

      transports: [
        new transports.File({
          filename: `${process.env.PATH_ERROR}/errors.log`,
        }),
      ],
    });
  }

  static log() {
    if (process.env.NODE_ENV === "production") {
      return this.production();
    } else {
      return this.development();
    }
  }
}
