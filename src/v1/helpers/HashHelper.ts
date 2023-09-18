import crypto from "crypto";

class EncryptionService {
  private static readonly secretKey: string = process.env.TOKEN_ACCESS || "";
  private static readonly iv: string = process.env.HASH_IV || "";

  private static createCipher() {
    return crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(EncryptionService.secretKey),
      Buffer.from(EncryptionService.iv)
    );
  }

  private static createDecipher() {
    return crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(EncryptionService.secretKey),
      Buffer.from(EncryptionService.iv)
    );
  }

  private static encrypt(text: string) {
    const cipher = EncryptionService.createCipher();
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  private static decrypt(encryptedText: string) {
    const decipher = EncryptionService.createDecipher();
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
