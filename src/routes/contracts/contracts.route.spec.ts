import { Express } from "express";
import Sequelize from "sequelize";
import request from "supertest";
import { seedDB } from "../../../scripts/seeder/script";
import { createApp } from "../../app";

describe("/contracts", () => {
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

  describe("/", () => {
    it("should return a list of user's non-terminated contracts", async () => {
      const result = await request(app)
        .get("/contracts")
        .set("profile_id", "1")
        .expect(200)
        .send();

      const contracts = result.body;
      expect(contracts).toHaveLength(1); //there is only one non terminated contract for this user
      expect(contracts[0].status).not.toBe("terminated");
    });
  });

  describe("/:id", () => {
    it("should return the contract", async () => {
      const result = await request(app)
        .get("/contracts/1")
        .set("profile_id", "1")
        .expect(200)
        .send();

      const contract = result.body;
      expect(contract.id).toBe(1);
    });

    it("should return 404 when the contract doesn't exist", async () => {
      await request(app)
        .get("/contracts/123")
        .set("profile_id", "1")
        .expect(404)
        .send();
    });

    it("should return 401 when the profile_id does't exist", async () => {
      await request(app)
        .get("/contracts/1")
        .set("profile_id", "123")
        .expect(401)
        .send();
    });

    it("should return 401 when no profile_id is set", async () => {
      await request(app).get("/contracts/1").expect(401).send();
    });

    it("should return 401 when the contract doens't belong to profile", async () => {
      await request(app)
        .get("/contracts/3")
        .set("profile_id", "1")
        .expect(401)
        .send();
    });
  });
});
