import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class Prefix extends Model {
  declare guildId: string;
  declare prefix: string;
}

Prefix.init(
  {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Prefix",
    tableName: "Prefix",
    timestamps: false,
  }
);

export default Prefix;
