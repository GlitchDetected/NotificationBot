import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class Commands extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Commands.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Commands", 
    tableName: "Commands", 
    timestamps: true,
  }
);

export default Commands;
