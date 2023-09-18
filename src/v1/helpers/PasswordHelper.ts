import bcrypt from "bcrypt";

export default class PasswordHelper {
  private static readonly PASSWORD_SALT = process.env.PASSWORD_SALT || "";

  public static async generate(password: string) {
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

  public static async verify(req_password: string, db_password: string) {
    try {
      const password: any = await bcrypt.compare(req_password, db_password);

      return {
        success: password
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to verify password.",
      };
    }
  }
}
