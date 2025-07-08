import { DataTypes, Model } from "sequelize";

import sequelize from "../index";

class DmNotifications extends Model {
    declare userId: string;

    declare enabled: boolean;
    declare embedcolor: number | null;
    declare source: string | null;
    declare thumbnail: string | null;
    declare message: string | null;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

DmNotifications.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        embedcolor: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "dmnotifications",
        tableName: "dmnotifications",
        timestamps: true
    }
);

export default DmNotifications;