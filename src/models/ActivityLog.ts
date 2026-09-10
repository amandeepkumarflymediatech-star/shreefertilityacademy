import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface ActivityLogAttributes {
  id?: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  createdAt?: Date;
}

export interface ActivityLogCreationAttributes extends Optional<ActivityLogAttributes, 'id'> {}

export class ActivityLog extends Model<ActivityLogAttributes, ActivityLogCreationAttributes> implements ActivityLogAttributes {
  declare id: any;
  declare actorId: any;
  declare action: any;
  declare entityType: any;
  declare entityId: any;
  declare oldValue: any;
  declare newValue: any;
  declare createdAt: any;
}

ActivityLog.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  actorId: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oldValue: {
    type: DataTypes.TEXT,
  },
  newValue: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'ActivityLog',
  updatedAt: false,
});
