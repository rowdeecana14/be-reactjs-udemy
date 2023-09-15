import fileUpload from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

export default class UploadMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction) {
    fileUpload({
      createParentPath: true,
      abortOnLimit: true,
      limitHandler: (req: Request, res: Response, next: NextFunction) => {
        res.status(StatusCodes.REQUEST_TOO_LONG).send({
          status: "Limit Reached",
          message: "Upload file limit reached, check your file size",
        });
      },
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
    })(req, res, (err: any) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          status: "Error",
          message: "File upload failed",
          error: err.message,
        });
      }

      next();
    });
  }
}
