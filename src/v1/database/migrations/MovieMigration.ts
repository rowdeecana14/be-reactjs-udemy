import Movie from "../../models/Movie";
import Migration from "../../core/Migration";

export default class MovieMigration {
  public async up() {
    await Migration.createTable(Movie);
  }

  public async down() {
    await Migration.dropTable(Movie);
  }
}
