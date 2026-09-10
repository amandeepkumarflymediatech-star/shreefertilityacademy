import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface ClassEnrollmentAttributes {
  id?: string;
  sessionId: string;
  studentId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassEnrollmentCreationAttributes extends Optional<ClassEnrollmentAttributes, 'id'> {}

export class ClassEnrollment extends Model<ClassEnrollmentAttributes, ClassEnrollmentCreationAttributes> implements ClassEnrollmentAttributes {
  declare id: any;
  declare sessionId: any;
  declare studentId: any;
  declare status: any;
  declare createdAt: any;
  declare updatedAt: any;
}

ClassEnrollment.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
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
  modelName: 'ClassEnrollment',
});
