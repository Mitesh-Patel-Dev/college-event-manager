import dotenv from "dotenv";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedEvents = async () => {
  try {
    await connectDB();

    const org = await User.findOne({ role: "organization" });
    if (!org) {
      console.log("No organization found. Please run seedOrganization.js first.");
      process.exit(1);
    }

    const events = [
      {
        title: "React & Next.js Advanced Masterclass",
        description: "Join us for an intensive workshop on building modern web applications with React 19 and Next.js 15. We will cover server components, streaming, and performance optimization.",
        category: "Workshop",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        time: "10:00 AM - 4:00 PM",
        venue: "Tech Hub Auditorium",
        max_capacity: 150,
        current_count: 142,
        organizer: "Computer Science Dept.",
        status: "upcoming",
        createdBy: org._id,
      },
      {
        title: "Global AI Summit 2026",
        description: "Explore the future of Artificial Intelligence. Keynotes by leading researchers, panel discussions, and hands-on workshops on LLMs, generative AI, and AI safety.",
        category: "Seminar",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
        time: "09:00 AM - 5:00 PM",
        venue: "Main Campus Convention Center",
        max_capacity: 500,
        current_count: 230,
        organizer: "AI Research Lab",
        status: "upcoming",
        createdBy: org._id,
      },
      {
        title: "Campus Coding Hackathon v5.0",
        description: "A 48-hour hackathon to build innovative solutions for campus life. Food, swag, and mentorship provided. Prizes worth $5000 for top teams.",
        category: "Hackathon",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // In a month
        time: "Starts Friday 6:00 PM",
        venue: "Innovation Lab",
        max_capacity: 200,
        current_count: 198,
        organizer: "Student Tech Club",
        status: "upcoming",
        createdBy: org._id,
      },
      {
        title: "Annual Cultural Fest: Nebula",
        description: "The biggest cultural event of the year! Featuring music performances, dance competitions, art exhibitions, and food stalls from around the world.",
        category: "Cultural",
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // In 2 months
        time: "11:00 AM onwards",
        venue: "Open Air Theatre",
        max_capacity: 1000,
        current_count: 850,
        organizer: "Cultural Council",
        status: "upcoming",
        createdBy: org._id,
      },
      {
        title: "Cybersecurity Bootcamp",
        description: "Learn the basics of ethical hacking, network security, and cryptography. Hands-on CTF challenges included.",
        category: "Technical",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        time: "02:00 PM - 06:00 PM",
        venue: "Lab 3A",
        max_capacity: 50,
        current_count: 50,
        organizer: "CyberSec Society",
        status: "completed",
        createdBy: org._id,
      }
    ];

    await Event.deleteMany({}); // Clear existing
    await Event.insertMany(events);

    console.log("✅ 5 Sample Events Added Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}\n`);
    process.exit(1);
  }
};

seedEvents();
