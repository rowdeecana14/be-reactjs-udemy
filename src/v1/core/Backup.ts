import path from "path";
import fs from "fs";
import Database from "./Database";
import { config as DB_CONFIG } from "./../config/DatabaseConfig";

class Backup {
  private static instance: Backup;
  private static mongoose: any = null;

  public static getInstance() {
    if (!Backup.instance) {
      Backup.instance = new Backup();
    }
    return Backup.instance;
  }

  public static async database() {
    console.log(`========= START DATABASE BACKUP =========`);
    const backup_dir = path.join(process.cwd(), "src/v1/database/backup");

    if (!fs.existsSync(backup_dir)) {
      fs.mkdirSync(backup_dir, { recursive: true });
    }

    this.mongoose = await Database.connect(DB_CONFIG.url);
    const collections = await this.mongoose.db.listCollections().toArray();

    for (const collection of collections) {
      console.log(`====> backing up ${collection.name}`);

      const data = await this.mongoose.db.collection(collection.name).find().toArray();
      const collectionDumpPath = path.join(backup_dir, `${collection.name}.json`);

      fs.writeFileSync(collectionDumpPath, JSON.stringify(data, null, 2));
      
      console.log(`====> backed up ${collection.name}`);
    }

    this.mongoose.close();
    console.log(`========= END DATABASE BACKUP =========`);
  }
}

(async () => {
  await Backup.database();
})();