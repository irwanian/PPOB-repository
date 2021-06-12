"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");
module.exports = (sequelize, DataTypes) => {
  class PdamCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  PdamCode.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.STRING(30),
      },
      updated_at: {
        type: DataTypes.STRING(30),
      },
    },
    {
      sequelize,
      modelName: "pdam_code",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(pdam_code, options) {
          pdam_code.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
          pdam_code.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
        beforeBulkCreate(pdam_code, options) {
          pdam_code.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
          pdam_code.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
        beforeUpdate(pdam_code, options) {
          pdam_code.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
      },
    }
  );

  return PdamCode;
};