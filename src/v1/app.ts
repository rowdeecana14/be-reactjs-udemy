import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./router";
import Middleware from "./core/Middleware";

const app: Application = express();
const version: string = process.env.VERSION || "v1";

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(`/api/${version}`, router);
app.use(express.static(__dirname + "/views/public"));
app.use(Middleware.handle('error'));

export default app;
