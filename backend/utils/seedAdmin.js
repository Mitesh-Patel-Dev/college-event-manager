import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

/**
 * Seed Script — Creates a default admin account.
 *
 * Run with: node utils/seedAdmin.js
 *
 * This is a one-time setup script. It checks for an existing admin
 * to avoid creating duplicates.
 */
const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log(`\n⚠️  Admin already exists: ${existingAdmin.email}`);
      console.log("   Skipping seed. Delete the existing admin first if you want to re-seed.\n");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Admin User",
      email: "admin@college.edu",
      password: "admin123",
      role: "admin",
      department: "Administration",
    });

    console.log("\n✅ Admin account created successfully!");
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log("   ⚠️  Change this password immediately in production!\n");

    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}\n`);
    process.exit(1);
  }
};

seedAdmin();
