import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface PasswordResetTokenAttributes {
  id?: string;
  email: string;
  token: string;
  expires: Date;
  createdAt?: Date;
}

export interface PasswordResetTokenCreationAttributes extends Optional<PasswordResetTokenAttributes, 'id'> {}

export class PasswordResetToken extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes> implements PasswordResetTokenAttributes {
  declare id: any;
  declare email: any;
  declare token: any;
  declare expires: any;
  declare createdAt: any;
}

PasswordResetToken.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'PasswordResetToken',
  updatedAt: false,
});
