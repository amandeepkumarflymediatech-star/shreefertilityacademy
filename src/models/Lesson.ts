import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface LessonAttributes {
  id?: string;
  chapterId: string;
  title: string;
  videoUrl?: string;
  content?: string;
  order: number;
  isPublished?: boolean;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonCreationAttributes extends Optional<LessonAttributes, 'id'> {}

export class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  declare id: any;
  declare chapterId: any;
  declare title: any;
  declare videoUrl: any;
  declare content: any;
  declare order: any;
  declare isPublished: any;
  declare duration: any;
  declare createdAt: any;
  declare updatedAt: any;
}

Lesson.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  chapterId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
  },
  duration: {
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
  modelName: 'Lesson',
});
