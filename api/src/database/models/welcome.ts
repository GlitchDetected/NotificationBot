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


class Welcome extends Model {
    declare guildId: string;

    declare enabled: boolean;
    declare channelId: string | null;

    declare message: {
        content: string | null;
        embed?: GuildEmbed;
    };

    declare roleIds: string[];
    declare pingIds: string[];
    declare deleteAfter?: number;
    declare deleteAfterLeave?: boolean;
    declare isRestorable: boolean;

    declare dm: {
        enabled: boolean;
        message: {
            content?: string;
            embed?: GuildEmbed;
        };
    };

    declare reactions: {
        welcomeMessageEmojis: string[];
        firstMessageEmojis: string[];
    };

    declare card: {
        enabled: boolean;
        inEmbed: boolean;
        background?: string;
        textColor?: number;
    };

    declare button: {
        enabled: boolean;
        style: 1 | 2 | 3 | 4;
        emoji?: string | null;
        label?: string | null;
        ping?: boolean;
        type: 0;
    };

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Welcome.init(
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
        message: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                content: "Welcome to the server {user.username}"
            }
        },
        roleIds: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: []
        },
        pingIds: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            defaultValue: []
        },
        deleteAfter: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deleteAfterLeave: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        isRestorable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        dm: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                enabled: false,
                message: { content: null }
            }
        },
        reactions: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                welcomeMessageEmojis: [],
                firstMessageEmojis: []
            }
        },
        card: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                enabled: false,
                inEmbed: false
            }
        },
        button: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {
                enabled: false,
                style: 1,
                type: 0
            }
        }
    },
    {
        sequelize,
        modelName: "Welcome",
        tableName: "Welcome",
        timestamps: true
    }
);

export default Welcome;