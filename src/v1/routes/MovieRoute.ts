import { Router } from "express";
import MovieController from "../controllers/MovieController";
import AllMovieRequest from "../requests/movies/AllMovieRequest";
import StoreMovieRequest from "../requests/movies/StoreMovieRequest";
import ShowMovieRequest from "../requests/movies/ShowMovieRequest";
import UpdateMovieRequest from "../requests/movies/UpdateMovieRequest";
import DeleteMovieRequest from "../requests/movies/DeleteMovieRequest";

import ShowManyMovieRequest from "../requests/movies/ShowManyMovieRequest";
import UpdateStatusMovieRequest from "../requests/movies/UpdateStatusMovieRequest";
import StoreManyMovieRequest from "../requests/movies/StoreManyMovieRequest";
import UpdateManyMovieRequest from "../requests/movies/UpdateManyMovieRequest";

const routes = Router();
routes.get("/", AllMovieRequest.validate, MovieController.all);
routes.post("/", StoreMovieRequest.validate, MovieController.store);
routes.get("/search");
routes.get("/bulk", ShowManyMovieRequest.validate, MovieController.showMany);
routes.post("/bulk/status", UpdateStatusMovieRequest.validate, MovieController.status);
routes.post("/bulk", StoreManyMovieRequest.validate, MovieController.storeMany);
routes.put("/bulk", UpdateManyMovieRequest.validate, MovieController.updateMany);
routes.delete("/bulk");
routes.get("/:id/status");
routes.get("/:id", ShowMovieRequest.validate, MovieController.show);
routes.put("/:id", UpdateMovieRequest.validate, MovieController.update);
routes.delete("/:id", DeleteMovieRequest.validate, MovieController.delete);

export const MovieRoute = { routes };