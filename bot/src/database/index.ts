import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const connection = process.env.pgConnectionString;

if (!connection) {
  throw new Error("Environment variable 'PG_CONNECTION_STRING' is not defined.");
}

const sequelize = new Sequelize(connection, {
  dialect: "postgres",
  logging: false // true when testing
});

export default sequelize;
