import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class Uptime extends Model {
  declare id: number;
  declare Uptime: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {}
}

Uptime.init(
  {
    Uptime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: "Uptime",
    tableName: "Uptime",
    timestamps: true
  }
);

export default Uptime;
