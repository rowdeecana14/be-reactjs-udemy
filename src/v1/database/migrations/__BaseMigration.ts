import Migration from "../../core/Migration";
import MovieMigration from "./MovieMigration";
import UserMigration from "./UserMigration";
import PostMigration from "./PostMigration";

(async () => {
  const action: string = process.argv[2];

  if (action === "up" || action === "down") {
    await Migration.call(MovieMigration, action);
    await Migration.call(UserMigration, action);
    await Migration.call(PostMigration, action);
    await Migration.run();
  }
})();
