import { sequelize } from "../lib/sequelize";
import * as models from "../models";
import bcrypt from "bcryptjs";

const { User } = models;

async function createAdmin() {
  try {
    console.log("Authenticating with database...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const email = "admin@shreefertilityacademy.com";
    const password = "Admin@123!"; // You can change this password later or here
    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: "Super Admin",
        email: email,
        password: hashedPassword,
        role: "ADMIN",
        isApproved: true,
      } as any,
    });

    if (created) {
      console.log(`Successfully created new admin user: ${email} with password: ${password}`);
    } else {
      console.log(`Admin user ${email} already exists. Updating password...`);
      await admin.update({ password: hashedPassword, role: "ADMIN", isApproved: true });
      console.log(`Successfully updated admin user: ${email} with password: ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Unable to create admin:", error);
    process.exit(1);
  }
}

createAdmin();
