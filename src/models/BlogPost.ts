import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface BlogPostAttributes {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  authorId: string;
  tags?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPostCreationAttributes extends Optional<BlogPostAttributes, 'id'> {}

export class BlogPost extends Model<BlogPostAttributes, BlogPostCreationAttributes> implements BlogPostAttributes {
  declare id: any;
  declare title: any;
  declare slug: any;
  declare content: any;
  declare excerpt: any;
  declare coverImage: any;
  declare published: any;
  declare authorId: any;
  declare tags: any;
  declare createdAt: any;
  declare updatedAt: any;
}

BlogPost.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  excerpt: {
    type: DataTypes.TEXT,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
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
  modelName: 'BlogPost',
});
