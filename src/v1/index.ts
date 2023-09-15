import dotenv from "dotenv";
import app from "./app";
import LoggerService from "./services/LoggerService";
import Database from "./core/Database";
import { config as DB_CONFIG } from "./config/DatabaseConfig";
dotenv.config();

const port: string = process.env.PORT || "10101";
const base_url: string = process.env.BASE_URL || "http://127.0.0.1";
const version: string = process.env.VERSION || "v1";
let database: any = null;

app.listen(parseInt(port), async () => {
  database = await Database.connect(DB_CONFIG.url);
  console.log("LISTENING ON \x1b[4m%s\x1b[0m", `${base_url}:${port}/api/${version}`);
});

process.on("SIGINT ", () => {
  console.log("STOPPING \x1b[4m%s\x1b[0m", `${base_url}:${port}`);

  const errors = {
    message: `${base_url}:${port}`,
  };

  LoggerService.log().error(`Server stop:`, errors);
  database.close();
  process.exit(0);
});
