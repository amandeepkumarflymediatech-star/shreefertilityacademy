import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface LiveClassAttributes {
  id?: string;
  tutorId: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  meetingUrl?: string;
  recordingUrl?: string;
  status?: string;
  reminderSent24h?: boolean;
  reminderSent2h?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LiveClassCreationAttributes extends Optional<LiveClassAttributes, 'id'> {}

export class LiveClass extends Model<LiveClassAttributes, LiveClassCreationAttributes> implements LiveClassAttributes {
  declare id: any;
  declare tutorId: any;
  declare title: any;
  declare description: any;
  declare scheduledAt: any;
  declare meetingUrl: any;
  declare recordingUrl: any;
  declare status: any;
  declare reminderSent24h: any;
  declare reminderSent2h: any;
  declare createdAt: any;
  declare updatedAt: any;
}

LiveClass.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  tutorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  meetingUrl: {
    type: DataTypes.STRING,
  },
  recordingUrl: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
  },
  reminderSent24h: {
    type: DataTypes.BOOLEAN,
  },
  reminderSent2h: {
    type: DataTypes.BOOLEAN,
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
  modelName: 'LiveClass',
});
