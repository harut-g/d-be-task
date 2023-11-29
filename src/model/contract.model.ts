import Sequelize, { ForeignKey, Model, Optional } from "sequelize";
import { Profile } from "./profile.model";

export enum ContractStatus {
  New = "new",
  InProgress = "in_progress",
  Terminated = "terminated",
}

type ContractAttributes = {
  id: number;
  terms: string;
  status: ContractStatus;
  ClientId: ForeignKey<Profile["id"]>;
  ContractorId: ForeignKey<Profile["id"]>;
};

type ContractCreationAttributes = Optional<ContractAttributes, "id">;

export class Contract extends Model<
  ContractAttributes,
  ContractCreationAttributes
> {
  declare id: number;
  declare terms: string;
  declare status: ContractStatus;
  declare ClientId: Sequelize.ForeignKey<Profile["id"]>;
  declare ContractorId: Sequelize.ForeignKey<Profile["id"]>;
}

export function initContractModel(sequelize: Sequelize.Sequelize) {
  Contract.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      terms: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("new", "in_progress", "terminated"),
      },
    },
    {
      sequelize,
      modelName: "Contract",
    },
  );
}
