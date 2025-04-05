const initModels = require("../../models/init-models");
const dbconfig = require("../config.json");
const { Sequelize } = require("sequelize");

const db = dbconfig[process.env.NODE_ENV];
const { database, username, password, host, dialect } = db;
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});
const databases = initModels(sequelize);

module.exports = databases;
