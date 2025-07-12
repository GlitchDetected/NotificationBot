import "@dotenvx/dotenvx/config";

export default {
  development: {
    url: process.env.pgConnectionString,
    dialect: "postgres"
  },
  test: {
    url: process.env.pgConnectionString,
    dialect: "postgres"
  },
  production: {
    url: process.env.pgConnectionString,
    dialect: "postgres"
  }
};