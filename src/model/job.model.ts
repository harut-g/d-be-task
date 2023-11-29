import Sequelize, { ForeignKey, Model, Optional } from "sequelize";
import { Contract } from "./contract.model";

type JobAttributes = {
  id: number;
  description: string;
  price: number;
  paid: boolean;
  paymentDate?: Date;
  ContractId: ForeignKey<Contract["id"]>;
};
type JobCreationAttributes = Optional<
  JobAttributes,
  "id" | "paid" | "paymentDate"
>;

export class Job extends Model<JobAttributes, JobCreationAttributes> {
  declare id: number;
  declare description: string;
  declare price: number;
  declare paid: boolean;
  declare paymentDate?: Date;
  declare ContractId: Sequelize.ForeignKey<Contract["id"]>;
}

export function initJobModel(sequelize: Sequelize.Sequelize) {
  Job.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: "Job",
    },
  );
}
