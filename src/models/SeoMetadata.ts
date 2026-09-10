import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface SeoMetadataAttributes {
  id?: string;
  pagePath: string;
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  headerScripts?: string;
  footerScripts?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeoMetadataCreationAttributes extends Optional<SeoMetadataAttributes, 'id'> {}

export class SeoMetadata extends Model<SeoMetadataAttributes, SeoMetadataCreationAttributes> implements SeoMetadataAttributes {
  declare id: any;
  declare pagePath: any;
  declare title: any;
  declare description: any;
  declare keywords: any;
  declare ogImage: any;
  declare canonicalUrl: any;
  declare ogTitle: any;
  declare ogDescription: any;
  declare headerScripts: any;
  declare footerScripts: any;
  declare createdAt: any;
  declare updatedAt: any;
}

SeoMetadata.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  pagePath: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  keywords: {
    type: DataTypes.TEXT,
  },
  ogImage: {
    type: DataTypes.STRING,
  },
  canonicalUrl: {
    type: DataTypes.STRING,
  },
  ogTitle: {
    type: DataTypes.STRING,
  },
  ogDescription: {
    type: DataTypes.TEXT,
  },
  headerScripts: {
    type: DataTypes.TEXT,
  },
  footerScripts: {
    type: DataTypes.TEXT,
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
  modelName: 'SeoMetadata',
});
