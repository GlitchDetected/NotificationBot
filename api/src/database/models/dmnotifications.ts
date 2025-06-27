import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class dmnotifications extends Model {
  declare userId: string;

  declare embedcolor: string | null;
  declare source: string | null;

  declare message: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

dmnotifications.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    embedcolor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#FF0000"
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "You got a new notifications from"
    }
  },
  {
    sequelize,
    modelName: "dmnotifications",
    tableName: "dmnotifications",
    timestamps: true
  }
);

export default dmnotifications;
