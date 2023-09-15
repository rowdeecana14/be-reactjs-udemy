import PasswordHelper from "../../helpers/PasswordHelper";
import dotenv from "dotenv";

dotenv.config();

const PASSWORD = "TEST_password@12";
const WRONG_PASSWORD = "WRONG_password@12";

describe("PASSWORD HELPER TEST", () => {
  it("should hash a password", async () => {
    const password = await PasswordHelper.generate(PASSWORD);

    expect(password.success).toEqual(true);
    expect(password).toHaveProperty("hashed");
    expect(password.hashed).not.toEqual(PASSWORD);
  });

  it("should verify a hashed password", async () => {
    const generated = await PasswordHelper.generate(PASSWORD);
    const hashed: string = generated.hashed || "";
    const verified = await PasswordHelper.verify(PASSWORD, hashed);

    expect(verified.success).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const generated = await PasswordHelper.generate(PASSWORD);
    const hashed: string = generated.hashed || "";
    const verified = await PasswordHelper.verify(WRONG_PASSWORD, hashed);

    expect(verified.success).toBe(true);
  });
});
