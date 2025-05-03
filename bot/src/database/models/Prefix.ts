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
      unique: true,
    },
    prefix: {
      type: DataTypes.STRING,
      defaultValue: "`",
      allowNull: false,
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
