import { DataTypes } from "sequelize"

// 基础模型表

export const BASEMODEL_TABLE =  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }
