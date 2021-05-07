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
        allowNull: false,
      },
      product_id: {
        type: DataTypes.STRING(30),
      },
      denom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      selling_price: {
        type: DataTypes.INTEGER,
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
      modelName: "ppob_transaction",
      underscored: true,
      timestamps: false,
      hooks: {
        beforeCreate(ppob_transaction, options) {
          ppob_transaction.created_at = moment().format('YYYY-MM-DD HH:MM:SS');
          ppob_transaction.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        },
        beforeUpdate(ppob_transaction, options) {
          ppob_transaction.updated_at = moment().format('YYYY-MM-DD HH:MM:SS');
        },
      },
    }
  );

  return PPOBTansaction;
};