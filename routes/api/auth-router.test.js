import "dotenv/config";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app.js";
import User from "../../models/User.js";

const { DB_HOST, PORT = 3000, JWT_SECRET } = process.env;

describe("test signin route", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  //   afterEach(async () => {
  //     await User.deleteMany({});
  //   });

  test("test signin whith correct data", async () => {
    const signinData = {
      email: "dariazinch@gmail.com",
      password: "123Fgh",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signin")
      .send(signinData);

    expect(statusCode).toBe(200);

    const userSubscriptions = ["business", "pro", "starter"];

    expect(body).toEqual({
      token: expect.any(String),
      user: expect.objectContaining({
        email: expect.stringMatching(signinData.email),
        subscription: expect.any(String),
      }),
    });

    expect(body.token).not.toBe("");
    expect(userSubscriptions).toContain(body.user.subscription);

    const userData = await User.findOne({ email: signinData.email });
    const { id } = jwt.verify(body.token, JWT_SECRET);

    expect(id).toBe(userData._id.toString());

    expect(userData).toBeDefined();
    expect(userData.email).toBe(signinData.email);
    expect(userSubscriptions).toContain(userData.subscription);
  });
});
