import { Model, DataTypes } from "sequelize";
import sequelize from "../index";

export interface GuildEmbed {
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  image: string | null;
  color: number;
  footer: {
    text: string | null;
    icon_url: string | null;
  };
}


class Notifications extends Model {
  declare id: string;
  declare guildId: string;
  declare channelId: string;
  declare roleId: string | null

  declare type: 0 | 1 | 2 | 3;
  declare flags: number;
  declare regex: string | null;

  declare creatorId: string;

    declare message: {
    content: string | null;
    embed?: GuildEmbed;
  };

    declare creator: {
    id: string;
    username: string;
    customUrl: string;
    avatarUrl: string | null;
  };

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Notifications.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    flags: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    regex: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
        message: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        content: null,
      },
    },
    creator: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Notifications",
    tableName: "Notifications",
    timestamps: true
  }
);

export default Notifications;
