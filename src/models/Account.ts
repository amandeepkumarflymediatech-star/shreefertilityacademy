import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface AccountAttributes {
  id?: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  declare id: any;
  declare userId: any;
  declare type: any;
  declare provider: any;
  declare providerAccountId: any;
  declare refresh_token: any;
  declare access_token: any;
  declare expires_at: any;
  declare token_type: any;
  declare scope: any;
  declare id_token: any;
  declare session_state: any;
}

Account.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  providerAccountId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
  access_token: {
    type: DataTypes.TEXT,
  },
  expires_at: {
    type: DataTypes.INTEGER,
  },
  token_type: {
    type: DataTypes.STRING,
  },
  scope: {
    type: DataTypes.STRING,
  },
  id_token: {
    type: DataTypes.TEXT,
  },
  session_state: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Account',
  timestamps: false,
});
