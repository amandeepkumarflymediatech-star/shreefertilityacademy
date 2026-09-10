import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface ReviewAttributes {
  id?: string;
  studentId: string;
  tutorId?: string;
  rating?: number;
  content: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  declare id: any;
  declare studentId: any;
  declare tutorId: any;
  declare rating: any;
  declare content: any;
  declare isActive: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Review.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tutorId: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  modelName: 'Review',
});
