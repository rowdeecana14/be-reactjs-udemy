import data from "../backup/movies.json";
import Movie from "../../models/Movie";
import Seeder from "../../core/Seeder";

export default class MovieSeeder {
  public async up(): Promise<void> {
    await Seeder.insertData(Movie, data);
  }

  public async down(): Promise<void> {
    await Seeder.dropData(Movie);
  }
}
