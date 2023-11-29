import Sequelize from "sequelize";
import { Contract, initContractModel } from "./contract.model";
import { initJobModel, Job } from "./job.model";
import { initProfileModel, Profile } from "./profile.model";

export function connectToDatabase(options?: { log?: boolean }) {
  const logging = options?.log === undefined ? false : options?.log;

  const sequelize = new Sequelize.Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite3",
    logging: logging,
  });

  initProfileModel(sequelize);
  initContractModel(sequelize);
  initJobModel(sequelize);

  Profile.hasMany(Contract, { as: "Contractor", foreignKey: "ContractorId" });
  Contract.belongsTo(Profile, { as: "Contractor" });
  Profile.hasMany(Contract, { as: "Client", foreignKey: "ClientId" });
  Contract.belongsTo(Profile, { as: "Client" });
  Contract.hasMany(Job);
  Job.belongsTo(Contract);

  return sequelize;
}

export { Profile, Contract, Job };
