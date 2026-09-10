import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface MembershipAttributes {
  id?: string;
  studentId: string;
  startDate?: Date;
  validUntil: Date;
  status?: string;
  maxClasses?: number;
  usedClasses?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MembershipCreationAttributes extends Optional<MembershipAttributes, 'id'> {}

export class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  declare id: any;
  declare studentId: any;
  declare startDate: any;
  declare validUntil: any;
  declare status: any;
  declare maxClasses: any;
  declare usedClasses: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Membership.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  maxClasses: {
    type: DataTypes.INTEGER,
  },
  usedClasses: {
    type: DataTypes.INTEGER,
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
  modelName: 'Membership',
});
