import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface WebhookEventAttributes {
  id?: string;
  source?: string;
  eventId: string;
  eventType: string;
  payload: string;
  status?: string;
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WebhookEventCreationAttributes extends Optional<WebhookEventAttributes, 'id'> {}

export class WebhookEvent extends Model<WebhookEventAttributes, WebhookEventCreationAttributes> implements WebhookEventAttributes {
  declare id: any;
  declare source: any;
  declare eventId: any;
  declare eventType: any;
  declare payload: any;
  declare status: any;
  declare error: any;
  declare createdAt: any;
  declare updatedAt: any;
}

WebhookEvent.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  source: {
    type: DataTypes.STRING,
  },
  eventId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payload: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  error: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'WebhookEvent',
});
