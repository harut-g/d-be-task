import request from "supertest";
import { seedDB } from "../../../scripts/seeder/script";
import { Express } from "express";
import Sequelize from "sequelize";
import { createApp } from "../../app";
import { Profile } from "../../model";

describe("/balances/deposit/:userId", () => {
  let app: Express;
  let sequelize: Sequelize.Sequelize;

  beforeEach(async () => {
    await seedDB();

    const newApp = createApp();
    app = newApp.app;
    sequelize = newApp.sequelize;
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should deposit money on the balance of the client", async () => {
    const clientBeforeReposit = (await Profile.findOne({ where: { id: 1 } }))!;

    expect(clientBeforeReposit.balance).toBe(1150);

    const result = await request(app)
      .post("/balances/deposit/1")
      .set("profile_id", "1")
      .expect(200)
      .send({ amount: 10 });

    const clientAfterDeposit = result.body;

    expect(clientAfterDeposit.balance).toBe(1160);
  });

  it("should return error when the deposit is bigger 25% of jobs to pay", async () => {
    const clientBeforeReposit = (await Profile.findOne({ where: { id: 1 } }))!;

    expect(clientBeforeReposit.balance).toBe(1150);

    await request(app)
      .post("/balances/deposit/1")
      .set("profile_id", "1")
      .expect(400)
      .send({ amount: 1000 });
  });
});
