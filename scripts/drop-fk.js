const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:root@127.0.0.1:3306/shreefertilityacademy');

async function run() {
  try {
    await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `order_ibfk_2`;');
    console.log('Foreign key dropped successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

run();
