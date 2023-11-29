import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./model";
import Sequelize from "sequelize";

import { contractsRoute } from "./routes/contracts/contracts.route";
import { jobsRoute } from "./routes/jobs/jobs.route";
import { depositRoute } from "./routes/deposit/deposit.route";
import { adminRoute } from "./routes/admin/admin.route";

declare global {
  namespace Express {
    interface Request {
      sequelize: Sequelize.Sequelize;
    }
  }
}

export function createApp(options?: { sequelize?: { log?: boolean } }) {
  const sequelize = connectToDatabase(options?.sequelize);

  const app = express();

  app.use(bodyParser.json());
  app.set("sequelize", sequelize);
  app.set("models", sequelize.models);

  app.use(contractsRoute);
  app.use(jobsRoute);
  app.use(depositRoute);
  app.use(adminRoute);

  return { app, sequelize };
}
