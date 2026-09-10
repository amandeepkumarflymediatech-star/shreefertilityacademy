import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface LessonProgressAttributes {
  id?: string;
  studentId: string;
  lessonId: string;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonProgressCreationAttributes extends Optional<LessonProgressAttributes, 'id'> {}

export class LessonProgress extends Model<LessonProgressAttributes, LessonProgressCreationAttributes> implements LessonProgressAttributes {
  declare id: any;
  declare studentId: any;
  declare lessonId: any;
  declare isCompleted: any;
  declare createdAt: any;
  declare updatedAt: any;
}

LessonProgress.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lessonId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
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
  modelName: 'LessonProgress',
});
