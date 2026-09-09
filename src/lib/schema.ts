import { config } from "dotenv";
config(); // Load .env before initializing models

import { sequelize } from "./sequelize";
import * as models from "../models"; // Ensure models are imported so they register with sequelize
console.log(`Registered ${Object.keys(models).length} models.`);

async function syncDatabase() {
  try {
    console.log("Authenticating with database...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    console.log("Syncing database schema...");
    // Using alter: true will modify tables to match models without dropping them.
    // Be careful with force: true in production, as it will drop all tables!
    await sequelize.sync({ alter: true });
    
    console.log("Database schema synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to sync the database:", error);
    process.exit(1);
  }
}

syncDatabase();
