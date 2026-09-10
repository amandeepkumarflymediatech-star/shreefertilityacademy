import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface CourseAttributes {
  id?: string;
  title: string;
  description?: string;
  coverImage?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare id: any;
  declare title: any;
  declare description: any;
  declare coverImage: any;
  declare isPublished: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Course.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  modelName: 'Course',
});
