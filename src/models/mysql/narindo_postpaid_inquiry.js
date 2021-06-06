"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");
module.exports = (sequelize, DataTypes) => {
  class NarindoPostpaidInquiry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  NarindoPostpaidInquiry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ptype: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      destination_number: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      detail: {
        type: DataTypes.JSON,
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
      modelName: "narindo_postpaid_inquiry",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(midtrans_payment_channel, options) {
          midtrans_payment_channel.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
          midtrans_payment_channel.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
        beforeUpdate(midtrans_payment_channel, options) {
          midtrans_payment_channel.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
      },
    }
  );

  return NarindoPostpaidInquiry;
};