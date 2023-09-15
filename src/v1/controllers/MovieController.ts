import { StatusCodes } from "http-status-codes";
import Movie from "../models/Movie";
import { Request, Response } from "../core/Express";
import Pagination from "../core/Pagination";
import Controller from "../core/Controller";
import { ACTIONS, MODULES } from "../utils/enums/LogEnum";
// import models from "../models/Model";
// const { Movie, Log } = models;

export default class MovieController extends Controller {
  // @desc    List of movies
  // @route   GET /v1/api/movies
  // @access  Public
  public static async all(req: Request, res: Response) {
    const { filters, sort, skip, limit, pagination } = await Pagination.paginate(
      Movie,
      ["title", "summary"],
      req.validated
    );

    const movies = await Movie.find(filters)
      .select(["_id", "title", "summary", "url", "release_at", "status"])
      .sort(sort)
      .skip(skip)
      .limit(limit)
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
    const movie = await Movie.create(req.validated);
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
    await Movie.updateOne({ _id: id }, data).exec();

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
    await Movie.deleteOne({ _id: id });

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
    await Movie.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status: status,
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
    const movies = await Movie.insertMany(req.validated.movies);
    const data = movies.map((movie: any) => {
      return { _id: movie._id };
    });

    return res.status(StatusCodes.OK).json({
      data: data,
      message: "Movie successfully created.",
    });
  }

  // @desc    Update many movies
  // @route   PUT /v1/api/movies/bulk
  // @access  Public
  public static async updateMany(req: Request, res: Response) {
    const movies: any[] = req.validated.movies || [];

    const promise = movies.map(async (movie) => {
      const { id, ...data } = movie;
      await Movie.updateOne({ _id: id }, data).exec();

      return { id: movie.id };
    });
    const data = await Promise.all(promise);

    return res.status(StatusCodes.OK).json({
      data: data,
      message: "Movies successfully updated.",
    });
  }
}
