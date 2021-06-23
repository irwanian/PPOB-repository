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
      payment_code: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      nominal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expired_at: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      paid_at: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      payment_channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(['pending', 'failyre', 'deny', 'cancel', 'expire', 'settlement']),
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
      modelName: "payment",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(payment, options) {
          payment.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
          payment.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
        beforeUpdate(payment, options) {
          payment.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
      },
    }
  );

  return Payment;
};