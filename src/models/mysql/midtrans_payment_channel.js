"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");
module.exports = (sequelize, DataTypes) => {
  class MidtransPaymentChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  MidtransPaymentChannel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      payment_channel: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.STRING(70),
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
      modelName: "midtrans_payment_channel",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(midtrans_payment_channel, options) {
          midtrans_payment_channel.created_at = moment().format('YYYY-MM-DD HH:MM:SS');
          midtrans_payment_channel.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        },
        beforeUpdate(midtrans_payment_channel, options) {
          midtrans_payment_channel.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        },
      },
    }
  );

  return MidtransPaymentChannel;
};