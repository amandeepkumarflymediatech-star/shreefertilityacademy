import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface PaymentAttributes {
  id?: string;
  orderId: string;
  studentId: string;
  amount: number;
  currency?: string;
  merchantTransactionId: string;
  phonepeTransactionId?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: any;
  declare orderId: any;
  declare studentId: any;
  declare amount: any;
  declare currency: any;
  declare merchantTransactionId: any;
  declare phonepeTransactionId: any;
  declare status: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Payment.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
  },
  merchantTransactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phonepeTransactionId: {
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
  modelName: 'Payment',
});
