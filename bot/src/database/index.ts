import { Sequelize } from "sequelize";
import config from "../config";

const connection = config.databaseUri;

if (!connection) {
    throw new Error("Environment variable 'PG_CONNECTION_STRING' is not defined.");
}

const sequelize = new Sequelize(connection, {
    dialect: "postgres",
    logging: false
});

export default sequelize;