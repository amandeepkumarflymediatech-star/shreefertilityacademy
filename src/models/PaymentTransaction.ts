import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface PaymentTransactionAttributes {
  id?: string;
  paymentId: string;
  status: string;
  rawData: string;
  createdAt?: Date;
}

export interface PaymentTransactionCreationAttributes extends Optional<PaymentTransactionAttributes, 'id'> {}

export class PaymentTransaction extends Model<PaymentTransactionAttributes, PaymentTransactionCreationAttributes> implements PaymentTransactionAttributes {
  declare id: any;
  declare paymentId: any;
  declare status: any;
  declare rawData: any;
  declare createdAt: any;
}

PaymentTransaction.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rawData: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'PaymentTransaction',
  updatedAt: false,
});
