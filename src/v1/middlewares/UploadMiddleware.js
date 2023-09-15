import fileupload from "express-fileupload";

export default class UploadMiddleware {
  static handle() {
    return fileupload({
      createParentPath: true,
      abortOnLimit: true,
      limitHandler: (req, res, next) => {
        res.status(StatusCodes.REQUEST_TOO_LONG).send({
          status: "Limit Reached",
          message: "Upload file limit reached, check your file size",
        });
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    });
  }
}
