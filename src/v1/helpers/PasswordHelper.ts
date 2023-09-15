import bcrypt from "bcrypt";

interface IGenerate {
  success: boolean;
  hashed?: string;
  message?: string;
}

interface IVerify {
  success: boolean;
  password?: string;
  message?: string;
}

export default class PasswordHelper {
  private static readonly PASSWORD_SALT = process.env.PASSWORD_SALT || "";

  public static async generate(password: string): Promise<IGenerate> {
    try {
      const salt: any = bcrypt.genSaltSync(parseInt(PasswordHelper.PASSWORD_SALT));
      const hashed: any = bcrypt.hashSync(password, salt);

      return {
        success: true,
        hashed: hashed,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to hash password.",
      };
    }
  }

  public static async verify(req_password: string, db_password: string): Promise<IVerify> {
    try {
      const password: any = await bcrypt.compare(req_password, db_password);

      return {
        success: true,
        password: password,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify password.",
      };
    }
  }
}
