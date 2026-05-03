import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

/**
 * Seed Script — Creates a default organization account.
 *
 * Run with: node utils/seedAdmin.js
 *
 * This is a one-time setup script. It checks for an existing organization
 * before creating one to prevent duplicate keys.
 */
const seedAdmin = async () => {
  try {
    await connectDB();

    const existingOrg = await User.findOne({ role: "organization" });

    if (existingOrg) {
      console.log(`\n✅ Organization already exists: ${existingOrg.email}`);
      console.log("   Skipping seed. Delete the existing organization first if you want to re-seed.\n");
      process.exit(0);
    }

    const org = await User.create({
      name: "Main Organization",
      email: "org@college.edu",
      password: "orgpassword123",
      role: "organization",
    });

    console.log("\n🎉 Default organization created successfully!");
    console.log("   You can now log in using these credentials:");
    console.log(`   Email:    ${org.email}`);
    console.log(`   Password: orgpassword123`);
    console.log("   ⚠️  Change this password immediately in production!\n");

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}\n`);
    process.exit(1);
  }
};

seedAdmin();
