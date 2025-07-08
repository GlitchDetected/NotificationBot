import { Sequelize } from "sequelize";

const pgConnectionString = process.env.pgConnectionString;

if (!pgConnectionString) {
    throw new Error("Environment variable 'pgConnectionString' is not defined.");
}

const sequelize = new Sequelize(pgConnectionString, {
    dialect: "postgres",
    logging: false
});

export default sequelize;