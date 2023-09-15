import User from "../../models/User";
import Migration from "../../core/Migration";

export default class PostMigration {
  public async up() {
    await Migration.createTable(User);
  }

  public async down() {
    await Migration.dropTable(User);
  }
}
