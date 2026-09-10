const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:root@127.0.0.1:3306/shreefertilityacademy');

async function run() {
  try {
    await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `order_ibfk_4`;');
    console.log('Foreign key 4 dropped successfully.');
    await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `order_ibfk_1`;').catch(e => console.log('No order_ibfk_1'));
    await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `order_ibfk_3`;').catch(e => console.log('No order_ibfk_3'));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

run();
