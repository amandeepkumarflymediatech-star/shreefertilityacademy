import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface PricingPackageAttributes {
  id?: string;
  title: string;
  price: number;
  regularPrice?: number;
  classCount?: number;
  tagline?: string;
  validTill?: Date | null;
  features?: string; // Stored as JSON string
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PricingPackageCreationAttributes extends Optional<PricingPackageAttributes, 'id'> {}

export class PricingPackage extends Model<PricingPackageAttributes, PricingPackageCreationAttributes> implements PricingPackageAttributes {
  declare id: any;
  declare title: any;
  declare price: any;
  declare regularPrice: any;
  declare classCount: any;
  declare tagline: any;
  declare validTill: any;
  declare features: any;
  declare isActive: any;
  declare createdAt: any;
  declare updatedAt: any;
}

PricingPackage.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  regularPrice: {
    type: DataTypes.FLOAT,
  },
  classCount: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
  },
  tagline: {
    type: DataTypes.STRING,
  },
  validTill: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  features: {
    type: DataTypes.TEXT,
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
  modelName: 'PricingPackage',
});
