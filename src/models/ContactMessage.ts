import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface ContactMessageAttributes {
  id?: string;
  name: string;
  email: string;
  studyPreference: string;
  message: string;
  createdAt?: Date;
  status?: string;
}

export interface ContactMessageCreationAttributes extends Optional<ContactMessageAttributes, 'id'> {}

export class ContactMessage extends Model<ContactMessageAttributes, ContactMessageCreationAttributes> implements ContactMessageAttributes {
  declare id: any;
  declare name: any;
  declare email: any;
  declare studyPreference: any;
  declare message: any;
  declare createdAt: any;
  declare status: any;
}

ContactMessage.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studyPreference: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'UNREAD',
  },
}, {
  sequelize,
  modelName: 'ContactMessage',
});
