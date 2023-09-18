import Database from "./Database";
import { config as DB_CONFIG } from "../config/DatabaseConfig";

class Migration {
  private static instance: Migration;
  private migrations: any[] = [];
  private database: any = null;

  public static getInstance() {
    if (!Migration.instance) {
      Migration.instance = new Migration();
    }
    return Migration.instance;
  }

  public async call(MigrationClass: any, action: "up" | "down" = "up"): Promise<void> {
    this.migrations.push({
      migration: MigrationClass,
      action: action,
    });
  }

  public async run() {
    if (process.env.NODE_ENV !== "development") {
      console.log(`========= Database migration run only in DEVELOPMENT ENVIRONMENT =========`);
      return;
    }

    console.error(`========= START DATABASE MIGRATION =========`);
    this.database = await Database.connect(DB_CONFIG.url);

    for (const row of this.migrations) {
      const { migration, action } = row;
        const migrationClass = new migration();

      if (action === "up") {
        if (migrationClass.up && typeof migrationClass.up === "function") {
          await migrationClass.up();
        }
      } else {
        if (migrationClass.down && typeof migrationClass.down === "function") {
          await migrationClass.down();
        }
      }
    }

    this.database.close();
    console.error(`========= END DATABASE MIGRATION =========`);
  }

  public async createTable(Model: any) {
    const name = Model.collection.name;

    try {
      console.log(`====> creating table ${name}`);
      await this.database.db.createCollection(name);
      console.log(`====> created table ${name}`);
    } catch (error: any) {
      console.log(`Failed to create table ${name}.`, error.message);
    }
  }

  public async dropTable(Model: any) {
    const name = Model.collection.name;

    try {
      console.log(`====> dropping table ${name}`);
      const hasCollection: boolean = await this.hasCollection(name);

      if (hasCollection) {
        await this.database.db.dropCollection(name);
        console.log(`====> dropped table ${name}`);
      } else {
        console.log(`Table ${name} not exist in mongodb.`);
      }
    } catch (error: any) {
      console.log(`Failed to drop table ${name}.`, error.message);
    }
  }

  private async hasCollection(table: string) {
    const collections: [] = await this.database.db.listCollections().toArray();

    return collections.some((collection: any) => {
      return collection.name === table;
    });
  }
}
export default Migration.getInstance();
