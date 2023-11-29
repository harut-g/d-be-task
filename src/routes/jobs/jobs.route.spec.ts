import request from "supertest";
import { seedDB } from "../../../scripts/seeder/script";
import { Express } from "express";
import Sequelize from "sequelize";
import { createApp } from "../../app";
import { Profile } from "../../model";

describe("/jobs", () => {
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

  describe(":job_id/pay", () => {
    it("should pay for a unpaid job", async () => {
      const clientBeforePayment = (await Profile.findOne({
        where: { id: 1 },
      }))!;
      const contractorBeforePayment = (await Profile.findOne({
        where: { id: 5 },
      }))!;

      expect(clientBeforePayment.balance).toBe(1150);
      expect(contractorBeforePayment.balance).toBe(64);

      const result = await request(app)
        .post("/jobs/1/pay")
        .set("profile_id", "1")
        .expect(200)
        .send();

      const job = result.body;

      expect(job.id).toBe(1);
      expect(job.paid).toBeTruthy();
      expect(job.paymentDate).toBeDefined();

      const clientAfterPayment = (await Profile.findOne({ where: { id: 1 } }))!;
      const contractorAfterPayment = (await Profile.findOne({
        where: { id: 5 },
      }))!;

      expect(clientAfterPayment.balance).toBe(950); //-200
      expect(contractorAfterPayment.balance).toBe(264); //+200
    });
  });

  describe("/unpaid", () => {
    it("should return a list of user's non paid jobs", async () => {
      const result = await request(app)
        .get("/jobs/unpaid")
        .set("profile_id", "2")
        .expect(200)
        .send();

      const jobs = result.body;

      expect(jobs).toHaveLength(2); //this user has 2 unpaid jobs

      expect(jobs[0].paid).not.toBe(true);
      expect(jobs[1].paid).not.toBe(true);

      expect(jobs[0].id).toBe(3);
      expect(jobs[1].id).toBe(4);
    });
  });
});
