import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface PlatformSettingAttributes {
  id?: string;
  key: string;
  value: string;
  description?: string;
  updatedAt?: Date;
}

export interface PlatformSettingCreationAttributes extends Optional<PlatformSettingAttributes, 'id'> {}

export class PlatformSetting extends Model<PlatformSettingAttributes, PlatformSettingCreationAttributes> implements PlatformSettingAttributes {
  declare id: any;
  declare key: any;
  declare value: any;
  declare description: any;
  declare updatedAt: any;
}

PlatformSetting.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PlatformSetting',
  createdAt: false,
});
