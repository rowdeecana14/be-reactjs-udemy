import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const DB_DIALECT = process.env.DB_DIALECT || "mongodb";
export const DB_NAME = process.env.DB_NAME || "mongodb";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || "27017";

export interface IConfigs {
  [key: string]: {
    port: string | number;
    database: string;
    host: string;
    dialect: string;
    url: string;
  };
}

export const configs: IConfigs = {
  development: {
    port: DB_PORT,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    url: `${DB_DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  },
  testing: {
    port: DB_PORT,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    url: `${DB_DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  },
  production: {
    port: DB_PORT,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT,
    url: `${DB_DIALECT}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  },
};

export const config = configs[ENVIRONMENT];
