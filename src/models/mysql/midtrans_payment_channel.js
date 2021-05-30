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
      name: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(70),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.INTEGER,
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
      modelName: "midtrans_payment_channel",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(midtrans_payment_channel, options) {
          midtrans_payment_channel.created_at = moment().format('YYYY-MM-DD kk:mm:ss');
          midtrans_payment_channel.updated_at = moment().format('YYYY-MM-DD kk:mm:ss');
        },
        beforeUpdate(midtrans_payment_channel, options) {
          midtrans_payment_channel.updated_at = moment().format('YYYY-MM-DD kk:mm:ss');
        },
      },
    }
  );

  return MidtransPaymentChannel;
};