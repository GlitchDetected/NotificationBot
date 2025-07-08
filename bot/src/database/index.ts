import { Sequelize } from "sequelize";

const connection = process.env.pgConnectionString;

if (!connection) {
    throw new Error("Environment variable 'PG_CONNECTION_STRING' is not defined.");
}

const sequelize = new Sequelize(connection, {
    dialect: "postgres",
    logging: false
});

export default sequelize;