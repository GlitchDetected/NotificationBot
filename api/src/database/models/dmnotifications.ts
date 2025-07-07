import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class dmnotifications extends Model {
  declare userId: string;

  declare enabled: boolean;
  declare embedcolor: number | null;
  declare source: string | null;
  declare thumbnail: string | null;
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
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    embedcolor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
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
