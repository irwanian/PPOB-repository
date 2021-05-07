"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_channel: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(['pending', 'deny', 'cancel', 'expire', 'settlement']),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.INTEGER,
      },
      updated_at: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "payment",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(payment, options) {
          payment.created_at = moment().format('YYYY-MM-DD HH:MM:SS');
          payment.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        },
        beforeUpdate(payment, options) {
          payment.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        },
      },
    }
  );

  return Payment;
};