const { Sequelize } = require('sequelize');

const liveDbUrl = process.argv[2];

if (!liveDbUrl) {
  console.error("Please provide your live DATABASE_URL as an argument.");
  console.error("Example: node scripts/fix-live-db.js mysql://user:pass@host:3306/dbname");
  process.exit(1);
}

const sequelize = new Sequelize(liveDbUrl, { logging: console.log });

async function run() {
  try {
    console.log("Connecting to live database...");
    
    // Attempt to drop Order_ibfk_2
    try {
      await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `Order_ibfk_2`;');
      console.log('✅ Successfully dropped Order_ibfk_2');
    } catch (e) {
      if (e.message && e.message.includes('check that column/key exists')) {
        console.log('✅ Order_ibfk_2 is already dropped.');
      } else {
        throw e;
      }
    }
    
    // Also attempt to drop other legacy FKs just in case they exist on live
    try {
      await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `order_ibfk_4`;');
      console.log('✅ Successfully dropped order_ibfk_4');
    } catch (e) {}

    try {
      await sequelize.query('ALTER TABLE `Order` DROP FOREIGN KEY `order_ibfk_6`;');
      console.log('✅ Successfully dropped order_ibfk_6');
    } catch (e) {}

    console.log("Live Database fixed successfully!");
    process.exit(0);
  } catch (e) {
    console.error('Error fixing live database:', e);
    process.exit(1);
  }
}

run();
