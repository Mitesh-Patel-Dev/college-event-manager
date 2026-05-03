import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * Uses the MONGO_URI from environment variables.
 * Exits the process on connection failure to prevent silent errors.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
