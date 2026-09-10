const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: console.log });

async function run() {
  try {
    await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `Order_ibfk_2`;');
    console.log('Successfully dropped Order_ibfk_2');
    process.exit(0);
  } catch (e) {
    if (e.message && e.message.includes('check that column/key exists')) {
      console.log('Constraint already dropped.');
    } else {
      console.error('Error:', e);
    }
    process.exit(1);
  }
}
run();
