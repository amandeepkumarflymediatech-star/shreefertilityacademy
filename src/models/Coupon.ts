import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface CouponAttributes {
  id?: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  usedCount?: number;
  validUntil?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CouponCreationAttributes extends Optional<CouponAttributes, 'id'> {}

export class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  declare id: any;
  declare code: any;
  declare description: any;
  declare discountType: any;
  declare discountValue: any;
  declare maxUses: any;
  declare usedCount: any;
  declare validUntil: any;
  declare isActive: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Coupon.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  discountType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  maxUses: {
    type: DataTypes.INTEGER,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  validUntil: {
    type: DataTypes.DATE,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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
  modelName: 'Coupon',
});
