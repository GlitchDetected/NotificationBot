import { DataTypes, Model } from "sequelize";

import sequelize from "../index";

class User extends Model {
    declare email: string;
    declare id: string;
    declare username: string;
    declare displayName: string;
    declare avatarHash: string | null;

    declare accessToken: string;
    declare refreshToken: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avatarHash: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "User",
        tableName: "User",
        timestamps: true
    }
);

export default User;