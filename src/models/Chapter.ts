import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface ChapterAttributes {
  id?: string;
  courseId: string;
  title: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChapterCreationAttributes extends Optional<ChapterAttributes, 'id'> {}

export class Chapter extends Model<ChapterAttributes, ChapterCreationAttributes> implements ChapterAttributes {
  declare id: any;
  declare courseId: any;
  declare title: any;
  declare order: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Chapter.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  courseId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  modelName: 'Chapter',
});
