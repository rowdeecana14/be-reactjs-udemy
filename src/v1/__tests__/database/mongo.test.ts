import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection } from "mongoose";
import Database from "../../core/Database";

let server: MongoMemoryServer;
let database: Connection | undefined;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  database = await Database.connect(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await database?.close();
});

describe("MONGO DB TEST", () => {
  it("should connect to MongoDB", async () => {
    const info = server.instanceInfo;

    expect(database?.readyState).toBe(1);
    expect(info?.port).toBe(database?.port);
    expect(info?.ip).toBe(database?.host);
  });

  it("should disconnect to MongoDB", async () => {
    await database?.close();
    expect(database?.readyState).toBe(0);
  });
});
