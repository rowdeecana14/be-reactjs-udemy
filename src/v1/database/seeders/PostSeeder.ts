import data from "../backup/posts.json";
import Post from "../../models/Post";
import Seeder from "../../core/Seeder";

export default class PostSeeder {
  public async up(): Promise<void> {
    await Seeder.insertMany(Post, data);
  }

  public async down(): Promise<void> {
    await Seeder.dropData(Post);
  }
}
