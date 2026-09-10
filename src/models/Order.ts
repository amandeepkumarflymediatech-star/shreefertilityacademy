import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface OrderAttributes {
  id?: string;
  studentId: string;
  membershipId?: string;
  couponId?: string;
  amount: number;
  currency?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare id: any;
  declare studentId: any;
  declare membershipId: any;
  declare couponId: any;
  declare amount: any;
  declare currency: any;
  declare status: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Order.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membershipId: {
    type: DataTypes.STRING,
  },
  couponId: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
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
  modelName: 'Order',
});
