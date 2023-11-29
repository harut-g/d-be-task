import Sequelize, { Model, Optional } from "sequelize";

export enum ProfileType {
  Client = "client",
  Contractor = "contractor",
}

type ProfileAttributes = {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: ProfileType;
};
type ProfileCreationAttributes = Optional<ProfileAttributes, "id">;

export class Profile extends Model<
  ProfileAttributes,
  ProfileCreationAttributes
> {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare profession: string;
  declare balance: number;
  declare type: ProfileType;
}

export function initProfileModel(sequelize: Sequelize.Sequelize) {
  Profile.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(12, 2),
      },
      type: {
        type: Sequelize.ENUM(ProfileType.Contractor, ProfileType.Client),
      },
    },
    {
      sequelize,
      modelName: "Profile",
    },
  );
}
