import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class feednotifications extends Model {
  declare guildId: string;

  declare rssChannelId: string | null;
  declare rssLink: string | null;

  declare rssPingRoleId: string | null;

  declare feedCountKey: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

feednotifications.init(
  {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    feedCountKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rssChannelId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rssLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rssPingRoleId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "feednotifications",
    tableName: "feednotifications",
    timestamps: true
  }
);

export default feednotifications;
