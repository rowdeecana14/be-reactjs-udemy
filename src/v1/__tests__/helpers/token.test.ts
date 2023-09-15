import TokenHelper from "../../helpers/TokenHelper";
import dotenv from "dotenv";

dotenv.config();

const USER_DETAILS = {
  id: "1321",
  name: "Rudy Caña",
  username: "test",
};

describe("TOKEN HELPER TEST", () => {
  it("should generate a valid token", () => {
    const generated = TokenHelper.generate(USER_DETAILS, "access");

    expect(generated.success).toEqual(true);
    expect(typeof generated.token).toBe("string");
    expect(generated).toHaveProperty("token");
    expect(generated.token).toBeDefined();
  });

  it("should include the user data in the JWT token", async () => {
    const generated = TokenHelper.generate(USER_DETAILS, "access");
    const token = generated.token || "";
    const verified = await TokenHelper.verify(token, "access");

    expect(verified.success).toBe(true);
    expect(verified.data.id).toBe(USER_DETAILS.id);
    expect(verified.data.name).toBe(USER_DETAILS.name);
    expect(verified.data.username).toBe(USER_DETAILS.username);
  });

  it("should have an expiration time of 3 secs.", async () => {
    const generated = TokenHelper.generate(USER_DETAILS, "access", "3s");
    const token = generated.token || "";
    const expiration = 4000;

    const verified: any = await new Promise((resolve) =>
      setTimeout(async () => {
        const verified = await TokenHelper.verify(token, "access");
        resolve(verified);
      }, expiration)
    );

    expect(verified.success).toBe(false);
  });
});
