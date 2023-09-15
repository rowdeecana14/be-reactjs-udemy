import Seeder from "../../core/Seeder";
import UserSeeder from "./UserSeeder";
import MovieSeeder from "./MovieSeeder";
import PostSeeder from "./PostSeeder";

(async () => {
  const action: string = process.argv[2];

  if (action === "up" || action === "down") {
    await Seeder.call(UserSeeder, action);
    await Seeder.call(MovieSeeder, action);
    await Seeder.call(PostSeeder, action);
    await Seeder.run();
  }
})();
