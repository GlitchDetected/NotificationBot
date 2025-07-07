import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class FollowUpdates extends Model {
  declare guildId: string;
  declare id: string;
  declare name: string;
}

FollowUpdates.init(
  {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FollowUpdates",
    tableName: "FollowUpdates",
    timestamps: false,
  }
);

export default FollowUpdates;
