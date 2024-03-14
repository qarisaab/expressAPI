import { app } from "../server";
import supertest from "supertest";

describe("get req to /", () => {
  it("should send back some data", async () => {
    const res = await supertest(app).get("/");
    expect(res.body.message).toBe("hello");
  });
});
