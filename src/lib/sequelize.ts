import 'dotenv/config';
import { Sequelize } from 'sequelize';

const globalForSequelize = globalThis as unknown as { sequelize: Sequelize };

export const sequelize = globalForSequelize.sequelize || new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    freezeTableName: true
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForSequelize.sequelize = sequelize;
}
