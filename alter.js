"use strict";

// src/lib/schema.ts
var import_dotenv = require("dotenv");

// src/lib/sequelize.ts
var import_sequelize = require("sequelize");
var globalForSequelize = globalThis;
var sequelize = globalForSequelize.sequelize || new import_sequelize.Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    freezeTableName: true
  }
});
if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}

// src/lib/schema.ts
(0, import_dotenv.config)();
async function syncDatabase() {
  try {
    console.log("Authenticating with database...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log("Syncing database schema...");
    await sequelize.sync({ alter: true });
    console.log("Database schema synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to sync the database:", error);
    process.exit(1);
  }
}
syncDatabase();
