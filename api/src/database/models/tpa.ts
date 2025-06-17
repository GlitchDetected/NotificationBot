import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

class Tpa extends Model {
  declare youtubeDiscordChannelId: string | null;
  declare youtubeChannelUrl: string | null;

  declare tiktokDiscordChannelId: string | null;
  declare tiktokChannelUrl: string | null;

  declare twitchDiscordChannelId: string | null;
  declare twitchChannelUrl: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Tpa.init(
  {
    youtubeDiscordChannelId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    youtubeChannelUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tiktokDiscordChannelId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tiktokChannelUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitchDiscordChannelId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitchChannelUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Tpa",
    tableName: "Tpa",
    timestamps: true,
  }
);

export default Tpa;
