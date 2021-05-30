"use strict";
const { Model } = require("sequelize");
const moment = require("moment-timezone");
module.exports = (sequelize, DataTypes) => {
  class PPOBProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  PPOBProduct.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      denom: {
        type: DataTypes.STRING(20),
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
      is_active: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING(1500),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.STRING(20),
      },
      updated_at: {
        type: DataTypes.STRING(20),
      },
    },
    {
      sequelize,
      modelName: "ppob_product",
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate(ppob_product, options) {
          ppob_product.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD kk:mm:ss');
          ppob_product.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD kk:mm:ss');
        },
        beforeBulkCreate(ppob_product, options) {
          ppob_product.created_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD kk:mm:ss');
          ppob_product.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD kk:mm:ss');
        },
        beforeUpdate(ppob_product, options) {
          ppob_product.updated_at = moment().tz('Asia/Jakarta').format('YYYY-MM-DD kk:mm:ss');
        },
      },
    }
  );

  return PPOBProduct;
};