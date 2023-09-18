import { Router } from "express";
import RegisterAuthRequest from "../requests/auth/RegisterAuthRequest";
import LoginAuthRequest from "../requests/auth/LoginAuthRequest";
import AuthController from "../controllers/AuthController";

const routes = Router();
routes.post("/login", LoginAuthRequest.validate, AuthController.login);
routes.post("/register", RegisterAuthRequest.validate, AuthController.register);
routes.post("/logout", AuthController.logout);

export const AuthRoute = { routes };
