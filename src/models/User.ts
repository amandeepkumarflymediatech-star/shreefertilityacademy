import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export const RoleEnum = {
  ADMIN: 'ADMIN',
  TUTOR: 'TUTOR',
  STUDENT: 'STUDENT',
};

export const OnboardingStatusEnum = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
};

export interface UserAttributes {
  id?: string;
  email: string;
  name?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role?: any;
  isActive?: boolean;
  onboardingStatus?: any;
  phone?: string;
  timezone?: string;
  bio?: string;
  experience?: string;
  qualifications?: string;
  languages?: string;
  teachingHeadline?: string;
  teachingLevels?: string;
  teachingAges?: string;
  teachingStyle?: string;
  isApproved?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: any;
  declare email: any;
  declare name: any;
  declare emailVerified: any;
  declare image: any;
  declare password: any;
  declare role: any;
  declare isActive: any;
  declare onboardingStatus: any;
  declare phone: any;
  declare timezone: any;
  declare bio: any;
  declare experience: any;
  declare qualifications: any;
  declare languages: any;
  declare teachingHeadline: any;
  declare teachingLevels: any;
  declare teachingAges: any;
  declare teachingStyle: any;
  declare isApproved: any;
  declare addressLine1: any;
  declare addressLine2: any;
  declare city: any;
  declare state: any;
  declare country: any;
  declare zipCode: any;
  declare createdAt: any;
  declare updatedAt: any;
}

User.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  emailVerified: {
    type: DataTypes.DATE,
  },
  image: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  onboardingStatus: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  timezone: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  experience: {
    type: DataTypes.TEXT,
  },
  qualifications: {
    type: DataTypes.TEXT,
  },
  languages: {
    type: DataTypes.STRING,
  },
  teachingHeadline: {
    type: DataTypes.STRING,
  },
  teachingLevels: {
    type: DataTypes.STRING,
  },
  teachingAges: {
    type: DataTypes.STRING,
  },
  teachingStyle: {
    type: DataTypes.STRING,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
  },
  addressLine1: {
    type: DataTypes.STRING,
  },
  addressLine2: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  zipCode: {
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
  modelName: 'User',
});
