import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { TOKENS } from "../utils/enums/TokenEnum";
dotenv.config();

interface ITypes {
  [key: string]: {
    secret: string;
    options: {
      algorithm: jwt.Algorithm;
      expiresIn: string | number;
    };
  };
}

interface IData {
  _id?: any,
  name?: string;
  username?: string;
}

export default class TokenHelper {
  private static types: ITypes;

  private static loadEnv() {
    this.types = {
      access: {
        secret: process.env.TOKEN_ACCESS_SECRET || "",
        options: {
          algorithm: "HS256",
          expiresIn: process.env.TOKEN_ACCESS_EXPIRATION || "",
        },
      },
      refresh: {
        secret: process.env.TOKEN_REFRESH_SECRET || "",
        options: {
          algorithm: "HS256",
          expiresIn: process.env.TOKEN_REFRESH_EXPIRATION || "",
        },
      },
      links: {
        secret: process.env.TOKEN_LINKS_SECRET || "",
        options: {
          algorithm: "HS256",
          expiresIn: process.env.TOKEN_LINKS_EXPIRATION || "",
        },
      },
    };
  }

  public static generate(data: IData, type: TOKENS, expiration?: string) {
    try {
      this.loadEnv();

      if (!(type in this.types)) {
        return {
          success: false,
          message: "Hash type not exist.",
        };
      }

      const Type = this.types[type];
      const secret: jwt.Secret = Type.secret;
      const options: jwt.SignOptions = {
        algorithm: Type.options.algorithm || "HS256",
        expiresIn: expiration ?? Type.options.expiresIn,
      };

      return {
        success: true,
        token: jwt.sign(data, secret, options),
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async verify(token: string, type: TOKENS) {
    try {
      this.loadEnv();

      if (!(type in this.types)) {
        return {
          success: false,
          message: "Hash type not exist.",
        };
      }

      const Type = this.types[type];
      const data = jwt.verify(token as string, Type.secret, {
        algorithms: [Type.options.algorithm],
      });

      return { success: true, data: data };
    } catch (error: any) {
      return {
        success: false,
        message: error,
      };
    }
  }
}
