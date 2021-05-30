'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_POOL_MAX, DB_POOL_MIN } = process.env
// const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  pool: {
    max: Number(DB_POOL_MAX) || 30,
    min: Number(DB_POOL_MIN) || 1
  },
  timezone: '+07:00'
})

fs
  .readdirSync(`${__dirname}/mysql`)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, '/mysql/', file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db
