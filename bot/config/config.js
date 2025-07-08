import "@dotenvx/dotenvx/config";

module.exports = {
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
