import Middleware from "./core/Middleware";
import { Router } from "express";
import { AuthRoute } from "./routes/AuthRoute";
import { MovieRoute } from "./routes/MovieRoute";

const router = Router();
router.use("/auth", Middleware.handle('limit'), AuthRoute.routes);
router.use("/movies", Middleware.handle('auth'), MovieRoute.routes);

export default router;
