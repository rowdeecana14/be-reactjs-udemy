import Post from "../../models/Post";
import Migration from "../../core/Migration";

export default class PostMigration {
  public async up() {
    await Migration.createTable(Post);
  }

  public async down() {
    await Migration.dropTable(Post);
  }
}
