const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:root@127.0.0.1:3306/shreefertilityacademy');

async function run() {
  try {
    const [results] = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = 'shreefertilityacademy'
      AND TABLE_NAME = 'Order' 
      AND COLUMN_NAME = 'membershipId'
      AND REFERENCED_TABLE_NAME IS NOT NULL;
    `);
    
    for (const row of results) {
      console.log(`Dropping constraint: ${row.CONSTRAINT_NAME}`);
      try {
        await sequelize.query(`ALTER TABLE \`Order\` DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\`;`);
        console.log(`Dropped ${row.CONSTRAINT_NAME} successfully.`);
      } catch (err) {
        console.error(`Failed to drop ${row.CONSTRAINT_NAME}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error fetching constraints:', err.message);
  } finally {
    process.exit();
  }
}

run();
