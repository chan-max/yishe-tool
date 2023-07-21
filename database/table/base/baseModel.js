import { DataTypes } from "sequelize"

// 基础模型表

export const BASEMODEL_TABLE =  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }
