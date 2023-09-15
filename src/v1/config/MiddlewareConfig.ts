import AuthMiddleware from "../middlewares/AuthMiddleware";
// import LinkMiddleware from "./LinkMiddleware";
// import RolesMiddleware from "./RolesMiddleware";
// import PermissionsMiddleware from "./PermissionsMiddleware";
// import LimiterMiddleware from "./LimiterMiddleware";

export const middlewares: { [key: string]: any } = {
    "auth" : AuthMiddleware
};
