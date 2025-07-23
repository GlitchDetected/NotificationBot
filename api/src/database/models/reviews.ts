import { DataTypes, Model } from "sequelize";

import sequelize from "../index";

class Reviews extends Model {
    declare guildId: string;
    declare name: string;
    declare icon: string | null;
    declare memberCount: number;
    declare review: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Reviews.init(
    {
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        memberCount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        review: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: "Reviews",
        tableName: "Reviews",
        timestamps: true
    }
);

export default Reviews;