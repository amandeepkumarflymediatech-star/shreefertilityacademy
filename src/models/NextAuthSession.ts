import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface NextAuthSessionAttributes {
  id?: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface NextAuthSessionCreationAttributes extends Optional<NextAuthSessionAttributes, 'id'> {}

export class NextAuthSession extends Model<NextAuthSessionAttributes, NextAuthSessionCreationAttributes> implements NextAuthSessionAttributes {
  declare id: any;
  declare sessionToken: any;
  declare userId: any;
  declare expires: any;
}

NextAuthSession.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  sessionToken: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'NextAuthSession',
  timestamps: false,
});
