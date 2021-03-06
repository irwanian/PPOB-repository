"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");
module.exports = (sequelize, DataTypes) => {
  class PPOBTansaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  PPOBTansaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.JSON,
      },
      user_slug: {
        type: DataTypes.STRING(200)
      },
      destination_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(['pending', 'success', 'failed']),
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ppob_product_id: {
        type: DataTypes.INTEGER,
      },
      purchase_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      selling_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      detail: {
        type: DataTypes.JSON,
        allowNull: true
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
      modelName: "ppob_transaction",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(ppob_transaction, options) {
          ppob_transaction.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
          ppob_transaction.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
        beforeUpdate(ppob_transaction, options) {
          ppob_transaction.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        },
      },
    }
  );

  return PPOBTansaction;
};