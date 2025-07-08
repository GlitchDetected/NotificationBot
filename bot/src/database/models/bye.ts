import { DataTypes, Model } from "sequelize";

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


class Bye extends Model {
    declare guildId: string;

    declare enabled: boolean;
    declare channelId: string | null;
    declare webhookURL: string;

    declare message: {
        content: string | null;
        embed?: GuildEmbed;
    };

    declare deleteAfter: number;

    declare card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    };

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Bye.init(
    {
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        webhookURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                content: null
            }
        },
        deleteAfter: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        card: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                enabled: false,
                inEmbed: false
            }
        }
    },
    {
        sequelize,
        modelName: "Bye",
        tableName: "Bye",
        timestamps: true
    }
);

export default Bye;