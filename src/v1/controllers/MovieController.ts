import { StatusCodes } from "http-status-codes";
import Movie from "../models/Movie";
import { Request, Response, NextFunction } from "../core/Express";
import Pagination from "../core/Pagination";
import Controller from "../core/Controller";
import { ACTIONS, MODULES } from "../utils/enums/LogEnum";
import { ACTIONS as C_ACTIONS } from "../utils/enums/ControllerEnum";
// import models from "../models/Model";
// const { Movie, Log } = models;

export default class MovieController extends Controller {
  // @desc    List of movies
  // @route   GET /v1/api/movies
  // @access  Public
  public static async all(req: Request, res: Response, next: NextFunction) {
    const { sort, skip, limit, pagination } = await Pagination.paginate(
      Movie,
      req.validated
    );
    let filters = {};

    if(req.validated.search !== "") {
      filters = {
        title: { $regex: new RegExp(req.validated.search, "i") },
        summary: { $regex: new RegExp(req.validated.search, "i") },
        action: { $ne: C_ACTIONS.Deleted },
      }
    }

    const movies = await Movie.find(filters)
      .select(["_id", "title", "summary", "url", "release_at", "status", "created_by"])
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();


    return res.status(StatusCodes.OK).json({
      message: "Movies successfully fetched.",
      data: {
        pagination: pagination,
        rows: movies,
      },
    });
  }

  // @desc    Store one movie
  // @route   POST /v1/api/movies
  // @access  Public
  public static async store(req: Request, res: Response) {
    const auth = super.action(req, C_ACTIONS.Created);
    const movie = await Movie.create({
      ...req.validated,
      ...auth
    });
    await super.log(
      req,
      MODULES.Movies,
      ACTIONS.Created,
      `Created a user account for ${movie.title} with id ${movie._id}.`
    );

    return res.status(StatusCodes.OK).json({
      data: {
        id: movie._id,
      },
      message: "Movie successfully created.",
    });
  }

  // @desc    Get one movie
  // @route   GET /v1/api/id
  // @access  Public
  public static async show(req: Request, res: Response) {
    const movie = await Movie.findById(req.validated.id).exec();

    return res.status(StatusCodes.OK).json({
      data: movie,
      message: "Movie successfully fetched.",
    });
  }

  // @desc    Update one movie
  // @route   PUT /v1/api/id
  // @access  Public
  public static async update(req: Request, res: Response) {
    const { id, ...data } = req.validated;
    const auth = super.action(req, C_ACTIONS.Updated);

    await Movie.updateOne(
      { _id: id }, 
      { 
        ...data, 
        ...auth
      }
    ).exec();

    return res.status(StatusCodes.OK).json({
      data: { id: id },
      message: "Movie successfully updated.",
    });
  }

  // @desc    Delete one movie
  // @route   DELETE /v1/api/id
  // @access  Public
  public static async delete(req: Request, res: Response) {
    const { id } = req.validated;
    const auth = super.action(req, C_ACTIONS.Deleted);
    // await Movie.deleteOne({ _id: id });

    await Movie.updateOne({ _id: id }, auth).exec();

    return res.status(StatusCodes.OK).json({
      data: { id },
      message: "Movie successfully deleted.",
    });
  }

  // @desc    Get many movie by ids
  // @route   GET /v1/api/bulk
  // @access  Public
  public static async showMany(req: Request, res: Response) {
    const ids: string[] = req.validated.ids;
    const movies: any[] = await Movie.find({ _id: { $in: ids } }).exec();

    return res.status(StatusCodes.OK).json({
      data: movies,
      message: "Movies successfully fetched.",
    });
  }

  // @desc    Update movies status by ids
  // @route   POST /v1/api/movies/status
  // @access  Public
  public static async status(req: Request, res: Response) {
    const { ids, status } = req.validated;
    const auth = super.action(req, C_ACTIONS.Updated);

    await Movie.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status: status,
          ...auth
        },
      }
    );

    return res.status(StatusCodes.OK).json({
      data: {
        ids: ids,
      },
      message: "Movie status successfully updated.",
    });
  }

  // @desc    Store many movies
  // @route   POST /v1/api/movies/bulk
  // @access  Public
  public static async storeMany(req: Request, res: Response) {
    const auth = super.action(req, C_ACTIONS.Created);
    const data = req.validated.movies.map((movie: any) => {
      return { ...movie, ...auth}
    });
    const movies = await Movie.insertMany(data);
    const ids = movies.map((movie: any) => {
      return { _id: movie._id };
    });

    return res.status(StatusCodes.OK).json({
      data: { ids },
      message: "Movie successfully created.",
    });
  }

  // @desc    Update many movies
  // @route   PUT /v1/api/movies/bulk
  // @access  Public
  public static async updateMany(req: Request, res: Response) {
    const movies: any[] = req.validated.movies || [];
    const auth = super.action(req, C_ACTIONS.Updated);

    const promise = movies.map(async (movie) => {
      const { id, ...data } = movie;
      const updated = { ...data, ...auth };
      await Movie.updateOne({ _id: id }, updated).exec();

      return { id: movie.id };
    });
    const data = await Promise.all(promise);

    return res.status(StatusCodes.OK).json({
      data: data,
      message: "Movies successfully updated.",
    });
  }
}
