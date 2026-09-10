import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface NotificationAttributes {
  id?: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  relatedId?: string;
  createdAt?: Date;
}

export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> {}

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  declare id: any;
  declare userId: any;
  declare type: any;
  declare title: any;
  declare message: any;
  declare isRead: any;
  declare relatedId: any;
  declare createdAt: any;
}

Notification.init({
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  relatedId: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Notification',
  updatedAt: false,
});
