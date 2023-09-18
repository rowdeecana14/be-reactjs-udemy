import LimiterMiddleware from "../middlewares/LimiterMiddleware";
import ErrorsMiddleware from "../middlewares/ErrorsMiddleware";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import UploadMiddleware from "../middlewares/UploadMiddleware";

export const middlewares: { [key in string]: any } = {
  limit: LimiterMiddleware,
  error: ErrorsMiddleware,
  auth: AuthMiddleware,
  upload: UploadMiddleware,
};
